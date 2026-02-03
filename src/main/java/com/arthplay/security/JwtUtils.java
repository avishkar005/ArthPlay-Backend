package com.arthplay.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacKey(secret.getBytes(StandardCharsets.UTF_8));
    }

    /* ── generate ── */
    public String generateToken(String email, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /* ── extract email ── */
    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .parse(token)
                .payload()
                .getSubject();
    }

    /* ── extract userId ── */
    public String extractUserId(String token) {
        return (String) Jwts.parser()
                .verifyWith(getSigningKey())
                .parse(token)
                .payload()
                .get("userId");
    }

    /* ── validate ── */
    public boolean isValid(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).parse(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}
