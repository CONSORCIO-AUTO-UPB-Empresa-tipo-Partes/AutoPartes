package com.autopartes.BackendAutoPartes.config;

import com.autopartes.BackendAutoPartes.interceptor.AuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration class for Web MVC settings.
 * This class configures interceptors and resource handlers for the application.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final AuthInterceptor authInterceptor;

    /**
     * Constructor for WebMvcConfig.
     *
     * @param authInterceptor The AuthInterceptor to be used.
     */
    public WebMvcConfig(AuthInterceptor authInterceptor) {
        this.authInterceptor = authInterceptor;
    }

    /**
     * Adds interceptors to the registry.
     *
     * @param registry The InterceptorRegistry to add interceptors to.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor)
                .excludePathPatterns(
                        "/InicioSesionCliente.html",
                        "/Catalogo.html",
                        "/CatalogoPrincipal.html",
                        "/Registro.html",
                        "/api/auth/**",
                        "/css/**",
                        "/js/**",
                        "/img/**",
                        "/assets/**",
                        "/static/**"
                );
    }


    /**
     * Adds resource handlers to serve static resources.
     *
     * @param registry The ResourceHandlerRegistry to add resource handlers to.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}