#!/bin/sh
# Enable the HTTPS server block only when a real certificate is present.
#
# The same image runs on the production VM (certificates mounted from
# /etc/letsencrypt) and on developer machines (no certificates at all).
# nginx refuses to start if ssl_certificate points at a missing file, so the
# TLS config ships disabled and is installed here at container start-up.
set -e

DOMAIN="${WAYGO_DOMAIN:-waygo.duckdns.org}"
CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"
TARGET="/etc/nginx/conf.d/waygo-tls.conf"

if [ -f "$CERT" ] && [ -f "$KEY" ]; then
    sed "s|__WAYGO_DOMAIN__|${DOMAIN}|g" /etc/nginx/waygo-tls.conf.disabled > "$TARGET"
    echo "[waygo] HTTPS enabled for ${DOMAIN}"
else
    rm -f "$TARGET"
    echo "[waygo] no certificate at ${CERT} - serving plain HTTP only"
fi
