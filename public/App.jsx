import React from "react";

const NoCSSApp = () => {
    return (
        <div style={{ 
            fontFamily: 'Arial, sans-serif',
            minHeight: '100vh',
            background: '#ffffff',
            color: '#333333'
        }}>
            <header style={{ 
                background: '#16792f', 
                color: 'white', 
                padding: '1rem',
                textAlign: 'center' 
            }}>
                <h1>🎉 ¡REACT FUNCIONANDO SIN CSS!</h1>
                <p>El sistema básico está funcionando</p>
            </header>
            
            <main style={{ padding: '2rem' }}>
                <div style={{ 
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '2rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <h2 style={{ color: '#16792f', marginBottom: '1rem' }}>
                        ✅ React Funcionando - Sin CSS Import
                    </h2>
                    <p>Si puedes ver esto, React está funcionando correctamente sin CSS.</p>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <button style={{ 
                            background: '#16792f',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            marginRight: '1rem',
                            cursor: 'pointer'
                        }}>
                            Botón Primario
                        </button>
                        <button style={{ 
                            background: '#f3f4f6',
                            color: '#333333',
                            border: '1px solid #d1d5db',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}>
                            Botón Secundario
                        </button>
                    </div>
                </div>
            </main>
            
            <footer style={{
                background: '#f3f4f6',
                color: '#6b7280',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <p>© 2024 Química Industrial - Test Sin CSS ✨</p>
            </footer>
        </div>
    );
};

const ClientApp = () => <NoCSSApp />;

export { NoCSSApp, ClientApp };
export default ClientApp;
