import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UsersTable from './components/UsersTable'
import UserPosts from './components/UserPosts'
import { ToastProvider } from './contexts/ToastContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<UsersTable />} />
              <Route path="/users/:userId" element={<UserPosts />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
