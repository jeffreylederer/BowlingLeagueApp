import { BrowserRouter } from 'react-router-dom';
import RouteMenu from "@components/Routes.tsx";
import './App.css';
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'


const queryClient = new QueryClient();
function App() {
    return (
        <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <RouteMenu />

        </BrowserRouter>
        </QueryClientProvider>
    );

}

export default App;