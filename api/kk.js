async function login() {
    const response = await fetch('https://new2-gules.vercel.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'alice', password: '123456' })
    });
  
    const data = await response.json();
    if (response.ok) {
      console.log('登录成功', data.token); // 打印返回的 token
    } else {
      console.log('登录失败', data.message);
    }
  }
  
  login();
  