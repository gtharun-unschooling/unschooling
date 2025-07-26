// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase';
// import { signOut } from 'firebase/auth';
// import { useAuthState } from 'react-firebase-hooks/auth';

// const Navbar = () => {
//   const [user] = useAuthState(auth);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     signOut(auth).then(() => navigate('/'));
//   };

//   return (
//     <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
//       <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
//       {user ? (
//         <>
//           <span>Welcome, {user.email}</span>
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <button onClick={() => navigate('/login')}>Login</button>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
