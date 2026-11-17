"""
Servidor local de desenvolvimento.

Por que precisamos dele? Os módulos ES (import/export) e o fetch() do JSON
da cena NÃO funcionam abrindo o index.html direto (file://). Um servidor
HTTP simples resolve isso, sem instalar nada (só biblioteca padrão).

Uso:  python server.py   ->  http://localhost:8000
"""
import http.server
import socketserver
import webbrowser

PORTA = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    # Desativa cache: durante o desenvolvimento, F5 sempre pega o código novo.
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


# Garante o MIME correto para módulos JS e JSON
Handler.extensions_map.update({".js": "text/javascript", ".json": "application/json"})


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORTA), Handler) as httpd:
        url = f"http://localhost:{PORTA}"
        print(f"Servidor rodando em {url}  (Ctrl+C para parar)")
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado.")
