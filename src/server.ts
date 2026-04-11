import 'dotenv/config';
import { app } from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server está rodando na porta ${PORT}`);
    console.log(`📄 Docs: http://localhost:${PORT}/api-docs`);
});