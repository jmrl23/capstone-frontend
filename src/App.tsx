import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { WsContext } from '@/contexts/ws';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import Loading from '@/routes/Loading';
import NotFound from '@/routes/Notfound';
import Login from '@/routes/Login';
import Register from '@/routes/Register';
import Main from '@/routes/Main';
import Device from '@/routes/Device';
import Profile from './routes/Profile';

export default function App() {
  const { data: user, isLoading, refetch } = useUser();

  if (isLoading) return <Loading />;
  if (!user) return <RoutesWithoutUser refetch={refetch} />;
  return <RoutesWithUser user={user} refetch={refetch} />;
}

function RoutesWithUser(props: RoutesWithUserProps) {
  const socket = io(import.meta.env.VITE_WS_URL, {
    autoConnect: false,
    auth: {
      userId: props.user.id,
    },
  });

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <WsContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route
            path='/'
            element={<Main user={props.user} refetch={props.refetch} />}
          />
          <Route path='/login' element={<Navigate to={'/'} />} />
          <Route
            path='/profile'
            element={<Profile user={props.user} refetch={props.refetch} />}
          />
          <Route path='/device/:id' element={<Device />} />
        </Routes>
      </BrowserRouter>
    </WsContext.Provider>
  );
}

interface RoutesWithUserProps {
  user: User;
  refetch: () => void;
}

function RoutesWithoutUser(props: RoutesWithoutUserProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<NotFound />} />
        <Route path='/' element={<Navigate to={'/login'} />} />
        <Route path='/login' element={<Login refetch={props.refetch} />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

interface RoutesWithoutUserProps {
  refetch: () => void;
}
