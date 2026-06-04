package furniture.furniture.repository;

import furniture.furniture.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByBrandId(Long brandId);
    List<Product> findBySubCategoryId(Long subCategoryId);
    
    @Query("SELECT p FROM Product p WHERE p.subCategory.category.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchProducts(@Param("query") String query);
}
