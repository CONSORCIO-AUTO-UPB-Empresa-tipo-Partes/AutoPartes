package com.autopartes.BackendAutoPartes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Ruta absoluta al directorio de uploads
        String uploadPath = Paths.get(System.getProperty("user.dir"), "uploads", "images").toUri().toString();

        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadPath);
    }
}
