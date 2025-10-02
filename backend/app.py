from flask import Flask, send_from_directory, jsonify
import socket
import os


# Criar a aplicação Flask
app = Flask(__name__, static_folder='../frontend', static_url_path='/frontend')


# ==============================
# ROTAS DE FRONTEND
# ==============================

# Rota para servir o index.html do frontend
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

# Rota para servir outros arquivos estáticos do frontend (CSS, JS, etc.)
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# ==============================
# ROTAS DE API
# ==============================
@app.route("/api/status")
def status():
    """Verifica status da API"""
    return jsonify({
        "status": "online",
        "message": "API do Sistema de Ranking está funcionando",
        "version": "1.0"
    })

@app.route("/api/health")
def health_check():
    """Verifica saúde do sistema"""
    return jsonify({
        "status": "ok",
        "version": "1.0",
        "database": "ok",  # aqui futuramente você pode integrar com DB
        "environment": "development"
    })


# ==============================
# TRATAMENTO DE ERROS
# ==============================
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint não encontrado"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Erro interno do servidor"}), 500


# ==============================
# FUNÇÃO PARA PEGAR IP LOCAL
# ==============================
def obter_ip_local():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"


# ==============================
# MAIN
# ==============================
if __name__ == '__main__':
    ip_local = obter_ip_local()
    print("🚀 Iniciando RANKING GERAL - Unyleya")
    print(f"📍 Acesso local: http://localhost:7000")
    print(f"🌐 Acesso na rede: http://{ip_local}:7000")
    print(f"📊 API Status: http://{ip_local}:7000/api/status")
    print("⏹️  Para parar: Ctrl+C")
    print("-" * 50)
    
    app.run(
        debug=True,           # Modo desenvolvimento
        host='0.0.0.0',      # Permite acesso de outros dispositivos
        port=7000,           # Porta padrão
        threaded=True        # Suporte a múltiplas requisições
    )
