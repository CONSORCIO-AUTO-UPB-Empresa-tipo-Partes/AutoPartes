//package com.autopartes.BackendAutoPartes.interceptor;
//
//import com.autopartes.BackendAutoPartes.service.UserService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.servlet.HandlerInterceptor;
//
///**
// * AuthInterceptor is a Spring interceptor that checks for authentication
// * on incoming requests. It verifies if the user is authenticated and
// * redirects to the login page if not.
// */
//@Component
//public class AuthInterceptor implements HandlerInterceptor {
//
//    private final UserService userService;
//
//    public AuthInterceptor(UserService userService) {
//        this.userService = userService;
//    }
//
//    /**
//     * Intercepts incoming requests to check for authentication.
//     * If the request is not authenticated, it redirects to the login page or returns a 401 status.
//     *
//     * @param request  The HTTP request
//     * @param response The HTTP response
//     * @param handler  The handler for the request
//     * @return true if the request is authenticated, false otherwise
//     * @throws Exception if an error occurs during interception
//     */
//    @Override
//    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        // Skip authentication for login page and public resources
//        String path = request.getRequestURI();
//        if (isPublicResource(path)) {
//            return true;
//        }
//
//        // Check for token in header
//        String token = request.getHeader("Authorization");
//        if (token != null && token.startsWith("Bearer ")) {
//            token = token.substring(7);
//            if (userService.isTokenValid(token)) {
//                return true;
//            }
//        }
//
//        // If no valid token, redirect to login
//        if (path.endsWith(".html")) {
//            response.sendRedirect("/InicioSesionCliente.html");
//            return false;
//        }
//
//        // For API requests return 401
//        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//        return false;
//    }
//
//    private boolean isPublicResource(String path) {
//        return path.equals("/") ||
//               path.equals("/InicioSesionCliente.html") ||
//               path.equals("/InicioSesion.html") ||
//               path.equals("/Registro.html") ||
//               path.equals("/Catalogo.html") ||
//               path.equals("/CatalogoPrincipal.html") ||
//               path.equals("/PrincipalUltimo.html") ||
//               path.startsWith("/api/auth/") ||
//               path.startsWith("/static/") ||
//               path.endsWith(".js") ||
//               path.endsWith(".css") ||
//               path.endsWith(".png") ||
//               path.endsWith(".jpg") ||
//               path.endsWith(".ico");
//    }
//}