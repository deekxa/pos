import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const params = await context.params; // await params first
  const path = params.proxy ? params.proxy.join('/') : '';
  const backendUrl = `http://192.168.1.121:3000/api/${path}`;
  
  console.log('GET - Proxying to:', backendUrl);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');
    
    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { 'Set-Cookie': setCookie } : {},
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

export async function POST(request, context) {
  const params = await context.params;
  const path = params.proxy ? params.proxy.join('/') : '';
  const backendUrl = `http://192.168.1.121:3000/api/${path}`;
  
  console.log('POST - Proxying to:', backendUrl);
  
  try {
    const body = await request.json();
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');
    
    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { 'Set-Cookie': setCookie } : {},
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const params = await context.params;
  const path = params.proxy ? params.proxy.join('/') : '';
  const backendUrl = `http://192.168.1.121:3000/api/${path}`;
  
  console.log('PUT - Proxying to:', backendUrl);
  
  try {
    const body = await request.json();
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');
    
    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { 'Set-Cookie': setCookie } : {},
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  const path = params.proxy ? params.proxy.join('/') : '';
  const backendUrl = `http://192.168.1.121:3000/api/${path}`;
  
  console.log('DELETE - Proxying to:', backendUrl);
  
  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');
    
    return NextResponse.json(data, {
      status: response.status,
      headers: setCookie ? { 'Set-Cookie': setCookie } : {},
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
