package furniture.furniture.controller;

import furniture.furniture.model.Page;
import furniture.furniture.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PageController {

    private final PageRepository pageRepository;

    @GetMapping("/api/pages/{pageName}")
    public ResponseEntity<?> getPage(@PathVariable String pageName) {
        Page page = pageRepository.findByPageName(pageName.toLowerCase()).orElse(null);
        if (page == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(page);
    }

    @PutMapping("/api/admin/pages/{pageName}")
    public ResponseEntity<?> updatePage(
            @PathVariable String pageName,
            @RequestBody Map<String, String> request
    ) {
        String title = request.get("title");
        String content = request.get("content");

        if (title == null || content == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Title and Content are required!"));
        }

        Page page = pageRepository.findByPageName(pageName.toLowerCase())
                .orElse(null);

        if (page == null) {
            page = Page.builder()
                    .pageName(pageName.toLowerCase())
                    .title(title)
                    .content(content)
                    .build();
        } else {
            page.setTitle(title);
            page.setContent(content);
        }

        pageRepository.save(page);
        return ResponseEntity.ok(Map.of("message", "Page updated successfully!"));
    }
}
