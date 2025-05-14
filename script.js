// 登录表单提交
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const profileForm = document.getElementById('profileForm');
  const registerLink = document.getElementById('registerLink');

  // 登录功能
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = 'profile.html';
        } else {
          alert(data.message || '登录失败');
        }
      } catch (error) {
        console.error('登录错误:', error);
        alert('登录请求失败');
      }
    });
  }

  // 注册功能
  if (registerLink) {
    registerLink.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const username = prompt('请输入用户名:');
      if (!username) return;
      
      const password = prompt('请输入密码:');
      if (!password) return;
      
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('注册错误:', error);
        alert('注册请求失败');
      }
    });
  }

  // 检查登录状态
  function checkLogin() {
    const token = localStorage.getItem('token');
    const profileLink = document.querySelector('a[href="profile.html"]');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (token) {
      // 已登录
      if (loginLink) loginLink.style.display = 'none';
      
      // 如果在登录页，自动跳转到个人信息页
      if (window.location.pathname.includes('login.html')) {
        window.location.href = 'profile.html';
      }
      
      // 获取用户信息
      fetch('http://localhost:3000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          // 更新个人信息页面
          if (document.getElementById('profileName')) {
            document.getElementById('profileName').textContent = data.user.name || data.user.username;
            document.getElementById('profileJob').textContent = data.user.job || '未设置';
            document.getElementById('profileEmail').textContent = data.user.email || '未设置';
            document.getElementById('profileBio').textContent = data.user.bio || '未设置';
            
            // 填充编辑表单
            document.getElementById('editName').value = data.user.name || data.user.username;
            document.getElementById('editJob').value = data.user.job || '';
            document.getElementById('editEmail').value = data.user.email || '';
            document.getElementById('editBio').value = data.user.bio || '';
          }
        }
      })
      .catch(err => {
        console.error('获取用户信息失败:', err);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      });
    } else {
      // 未登录
      if (profileLink) profileLink.style.display = 'none';
      
      // 如果在个人信息页，自动跳转到登录页
      if (window.location.pathname.includes('profile.html')) {
        window.location.href = 'login.html';
      }
    }
  }

  // 退出登录
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  // 保存个人信息
  if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const name = document.getElementById('editName').value;
      const job = document.getElementById('editJob').value;
      const email = document.getElementById('editEmail').value;
      const bio = document.getElementById('editBio').value;
      
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name, job, email, bio })
        });
        
        const data = await response.json();
        if (data.success) {
          alert('个人信息已更新');
          checkLogin(); // 刷新信息
        } else {
          alert(data.message || '更新失败');
        }
      } catch (error) {
        console.error('更新信息错误:', error);
        alert('更新请求失败');
      }
    });
  }

  // 检查登录状态
  checkLogin();
});