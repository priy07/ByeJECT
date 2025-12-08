import fetch from 'node-fetch';

const BASE = 'http://localhost:3000';

async function run(){
  // random user to avoid collisions
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  console.log('Registering user...')
  let r = await fetch(`${BASE}/api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  let json = await r.json();
  console.log('register:', json)

  console.log('Logging in user...')
  r = await fetch(`${BASE}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  json = await r.json();
  console.log('login:', json)

  if(!json.token){
    console.error('No token returned; aborting test');
    return;
  }

  const token = json.token;

  console.log('Requesting protected /api/user/data with Bearer header...')
  r = await fetch(`${BASE}/api/user/data`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  json = await r.json();
  console.log('/api/user/data:', json)
}

run().catch(err=>console.error(err));
