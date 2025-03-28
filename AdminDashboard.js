// src/components/AdminDashboard.js
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [plan, setPlan] = useState(null);
  
    useEffect(() => {
      axios.get('/api/users')
        .then(res => setUsers(res.data))
        .catch(console.error);
  
      axios.get('/api/plans/current')
        .then(res => setPlan(res.data));
    }, []);
  
    return (
      <div>
        <h2>Plan: {plan?.name} ({plan?.maxUsers} users)</h2>
        <UserList users={users} />
      </div>
    );
  };