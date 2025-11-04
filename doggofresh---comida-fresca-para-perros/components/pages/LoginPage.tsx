
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { GoogleIcon } from '../icons/GoogleIcon';
import type { Page } from '../../App';

interface LoginPageProps {
    setCurrentPage: (page: Page) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage }) => {
    const { login, emailLogin, signup } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await login();
            setCurrentPage('account');
        } catch (err) {
            if (err instanceof Error && (err as any).code === 'auth/api-key-not-valid') {
                setError('La configuración de Firebase no es válida. Revisa tus credenciales en el archivo services/firebase.ts.');
            } else {
                setError(err instanceof Error ? err.message : 'Ocurrió un error con el inicio de sesión de Google.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            if (isLoginView) {
                await emailLogin(email, password);
            } else {
                await signup(name, email, password);
            }
            setCurrentPage('account');
        } catch (err) {
            if (err instanceof Error) {
                // FIX: Cast error to 'any' to access the 'code' property from Firebase errors.
                 switch ((err as any).code) {
                    case 'auth/api-key-not-valid':
                        setError('La configuración de Firebase no es válida. Revisa tus credenciales en el archivo services/firebase.ts.');
                        break;
                    case 'auth/wrong-password':
                        setError('Correo electrónico o contraseña incorrecta. Intenta de nuevo por favor.');
                        break;
                    case 'auth/user-not-found':
                        setError('Correo electrónico o contraseña incorrecta. Intenta de nuevo por favor.');
                        break;
                    case 'auth/email-already-in-use':
                        setError('Este correo ya está registrado. Intenta iniciar sesión.');
                        break;
                    case 'auth/weak-password':
                         setError('La contraseña debe tener al menos 6 caracteres.');
                         break;
                    default:
                        setError('El correo electrónico o la clave es incorrecta. Intenta de nuevo por favor.');
                }
            } else {
                 setError('Ocurrió un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-16 px-4 flex justify-center items-center">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg">
                <h1 className="text-4xl font-serif text-brand-brown mb-4 text-center">
                    {isLoginView ? 'Bienvenido de Vuelta' : 'Crea tu Cuenta'}
                </h1>
                <p className="text-gray-600 mb-8 text-center">
                    {isLoginView ? 'Inicia sesión para continuar.' : 'Únete a la familia DoggoFresh.'}
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
                    {!isLoginView && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-brand-brown" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-brand-brown" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green bg-white text-brand-brown" />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full bg-brand-green text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50">
                        {isLoading ? 'Cargando...' : (isLoginView ? 'Iniciar Sesión' : 'Registrarse')}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-4 text-gray-500 text-sm">O</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                
                <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-brand-brown font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                >
                    <GoogleIcon className="h-6 w-6" />
                    <span>Continuar con Google</span>
                </button>

                <p className="text-sm text-center text-gray-600 mt-8">
                    {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-semibold text-brand-green hover:underline ml-1">
                        {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};