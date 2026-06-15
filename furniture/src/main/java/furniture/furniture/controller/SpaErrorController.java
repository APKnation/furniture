package furniture.furniture.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError() {
        // Forward to the index.html for client-side routing to take over
        return "forward:/index.html";
    }
}
