package furniture.furniture.repository;

import furniture.furniture.model.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {
    Optional<Page> findByPageName(String pageName);
}
