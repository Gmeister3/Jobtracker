package jobtracker.service;

import jobtracker.model.JobApplication;
import jobtracker.repository.JobApplicationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    // READ all applications
    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    // CREATE a new application
    public JobApplication createApplication(JobApplication application) {
        application.setId(null);
        return repository.save(application);
    }

    // UPDATE an existing application
    public JobApplication updateApplication(
            Long id, JobApplication updatedApplication) {

        JobApplication existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Application not found"
                ));

        existing.setCompany(updatedApplication.getCompany());
        existing.setPosition(updatedApplication.getPosition());
        existing.setStatus(updatedApplication.getStatus());
        existing.setSalary(updatedApplication.getSalary());
        existing.setDateApplied(updatedApplication.getDateApplied());
        existing.setJobUrl(updatedApplication.getJobUrl());
        existing.setNotes(updatedApplication.getNotes());

        return repository.save(existing);
    }

    // DELETE an application
    public void deleteApplication(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Application not found"
            );
        }

        repository.deleteById(id);
    }
}