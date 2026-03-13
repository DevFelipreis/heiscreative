export default async function handler(req, res) {
    const user = "lfreis";
    const url = `https://www.behance.net/${user}.rss`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Erro ao acessar Behance");

        const xml = await response.text();

        // Configura o cabeçalho para permitir que seu site leia os dados
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).json({ error: "Falha na conexão com o servidor" });
    }
}