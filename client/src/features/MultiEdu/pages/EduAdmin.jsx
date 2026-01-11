import { useState } from 'react';
import { observer } from 'mobx-react';
import AdminPageContainer from '../components/admin/AdminPageContainer';

const EduAdmin = observer(() => {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  return (
    <AdminPageContainer
      selectedMenu={selectedMenu}
      onMenuSelect={setSelectedMenu}
    />
  );
});

export default EduAdmin;
