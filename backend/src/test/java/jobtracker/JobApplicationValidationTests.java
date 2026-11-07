package jobtracker;

import jakarta.validation.Validation;
import jobtracker.model.ApplicationStatus;
import jobtracker.model.JobApplication;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import static org.junit.jupiter.api.Assertions.*;

class JobApplicationValidationTests {
    @Test void acceptsValidApplicationWithOptionalFieldsEmpty() {
        var application = new JobApplication();
        application.setCompany("Example");
        application.setPosition("Developer");
        application.setStatus(ApplicationStatus.APPLIED);
        application.setDateApplied(LocalDate.of(2026, 11, 7));
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            assertTrue(factory.getValidator().validate(application).isEmpty());
        }
    }

    @Test void rejectsBlankRequiredFieldsNegativeSalaryAndLongNotes() {
        var application = new JobApplication();
        application.setCompany("   ");
        application.setPosition("");
        application.setSalary(-1);
        application.setNotes("x".repeat(2001));
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var fields = factory.getValidator().validate(application).stream()
                    .map(violation -> violation.getPropertyPath().toString()).collect(Collectors.toSet());
            assertEquals(Set.of("company", "position", "salary", "notes", "status", "dateApplied"), fields);
        }
    }
}
