package jobtracker;

import jobtracker.model.ApplicationStatus;
import jobtracker.model.JobApplication;
import jobtracker.repository.JobApplicationRepository;
import jobtracker.service.JobApplicationService;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobApplicationServiceTests {
    private final JobApplicationRepository repository = mock(JobApplicationRepository.class);
    private final JobApplicationService service = new JobApplicationService(repository);

    @Test void listsApplications() {
        var applications = List.of(new JobApplication());
        when(repository.findAll()).thenReturn(applications);
        assertEquals(applications, service.getAllApplications());
    }

    @Test void createDiscardsSuppliedId() {
        var application = new JobApplication();
        application.setId(99L);
        when(repository.save(application)).thenReturn(application);
        assertSame(application, service.createApplication(application));
        assertNull(application.getId());
        verify(repository).save(application);
    }

    @Test void updatePreservesIdAndSavesEveryField() {
        var existing = new JobApplication();
        existing.setId(1L);
        var update = new JobApplication();
        update.setId(99L);
        update.setCompany("Example Company");
        update.setPosition("Developer");
        update.setStatus(ApplicationStatus.INTERVIEW);
        update.setSalary(75000);
        update.setDateApplied(LocalDate.of(2026, 11, 7));
        update.setJobUrl("https://example.com/jobs");
        update.setNotes("Interview scheduled");
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(existing)).thenReturn(existing);
        var saved = service.updateApplication(1L, update);
        assertEquals(1L, saved.getId());
        assertEquals(update.getCompany(), saved.getCompany());
        assertEquals(update.getPosition(), saved.getPosition());
        assertEquals(update.getStatus(), saved.getStatus());
        assertEquals(update.getSalary(), saved.getSalary());
        assertEquals(update.getDateApplied(), saved.getDateApplied());
        assertEquals(update.getJobUrl(), saved.getJobUrl());
        assertEquals(update.getNotes(), saved.getNotes());
        verify(repository).save(existing);
    }

    @Test void missingUpdateReturns404WithoutSaving() {
        when(repository.findById(1L)).thenReturn(Optional.empty());
        var error = assertThrows(ResponseStatusException.class,
                () -> service.updateApplication(1L, new JobApplication()));
        assertEquals(404, error.getStatusCode().value());
        verify(repository, never()).save(any());
    }

    @Test void deletesExistingApplication() {
        when(repository.existsById(1L)).thenReturn(true);
        service.deleteApplication(1L);
        verify(repository).deleteById(1L);
    }

    @Test void missingDeleteReturns404WithoutDeleting() {
        var error = assertThrows(ResponseStatusException.class, () -> service.deleteApplication(1L));
        assertEquals(404, error.getStatusCode().value());
        verify(repository, never()).deleteById(any());
    }
}
