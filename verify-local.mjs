const base = 'http://localhost:3002';
const results = [];

function push(name, ok, detail) {
  results.push({ name, ok, detail });
}

for (const path of [
  '/',
  '/es',
  '/en',
  '/es/camper',
  '/es/faq',
  '/es/nexus',
  '/es/rutas',
  '/es/reservar',
  '/es/legal/aviso-legal',
  '/es/legal/condiciones',
  '/es/legal/cookies',
  '/es/legal/privacidad',
]) {
  const res = await fetch(base + path, { redirect: 'manual' });
  push(
    `GET ${path}`,
    res.status >= 200 && res.status < 400,
    `status=${res.status}${res.headers.get('location') ? `;location=${res.headers.get('location')}` : ''}`
  );
}

const campersRes = await fetch(base + '/api/campers');
const campers = await campersRes.json();
const camperId = campers.primaryCamperId || campers.campers?.[0]?.id || 'mock-camper-1';
push(
  'GET /api/campers',
  campersRes.ok && (campers.campers?.length || 0) > 0,
  `camperId=${camperId};count=${campers.campers?.length || 0}`
);

const availRes = await fetch(
  base +
    `/api/availability?camperId=${camperId}&startDate=2026-07-10T00:00:00.000Z&endDate=2026-07-12T00:00:00.000Z`
);
const avail = await availRes.json();
push(
  'GET /api/availability',
  availRes.ok,
  JSON.stringify({
    available: avail.available,
    blocked: avail.blockedDates?.length || 0,
    bookings: avail.existingBookings?.length || 0,
  })
);

const publicBookingRes = await fetch(base + '/api/bookings', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    startDate: '2026-07-20T00:00:00.000Z',
    endDate: '2026-07-23T00:00:00.000Z',
    camperId,
    customerData: {
      name: 'QA Tester',
      email: 'qa.public@example.com',
      phone: '+34600000000',
      dni: '12345678Z',
      license: 'LIC-123',
    },
  }),
});
const publicBooking = await publicBookingRes.json();
push(
  'POST /api/bookings',
  publicBookingRes.ok && publicBooking.success === true,
  `bookingId=${publicBooking.booking?.id}`
);

const loginRes = await fetch(base + '/api/admin/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'admin@camperyaba.com', password: 'camperyaba123' }),
});
const cookie = loginRes.headers.get('set-cookie')?.split(';')[0] || '';
push(
  'POST /api/admin/login',
  loginRes.ok && Boolean(cookie),
  `status=${loginRes.status};cookie=${Boolean(cookie)}`
);

const unauthorizedDashRes = await fetch(base + '/api/dashboard');
push(
  'GET /api/dashboard unauth',
  unauthorizedDashRes.status === 401,
  `status=${unauthorizedDashRes.status}`
);

const dashRes = await fetch(base + '/api/dashboard', { headers: { cookie } });
const dash = await dashRes.json();
const bookingId = dash.bookings?.[0]?.id;
push(
  'GET /api/dashboard auth',
  dashRes.ok && Boolean(bookingId),
  `bookingId=${bookingId};bookings=${dash.bookings?.length || 0}`
);

const protectedPageRes = await fetch(base + '/es/dashboard', {
  headers: { cookie },
  redirect: 'manual',
});
const protectedPageText = await protectedPageRes.text();
push(
  'GET /es/dashboard auth page',
  protectedPageRes.status === 200 &&
    (protectedPageText.includes('Panel operativo') ||
      protectedPageText.includes('Gestión de reservas, cobros y cuentas.')),
  `status=${protectedPageRes.status}`
);

const adminCreateRes = await fetch(base + '/api/dashboard/bookings', {
  method: 'POST',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify({
    camperId,
    startDate: '2026-08-01T00:00:00.000Z',
    endDate: '2026-08-04T00:00:00.000Z',
    paymentMethod: 'BANK_TRANSFER',
    status: 'CONFIRMED',
    notes: 'Alta QA',
    customerData: {
      name: 'QA Admin',
      email: 'qa.admin@example.com',
      phone: '+34611111111',
      dni: '11111111A',
      license: 'ADM-1',
    },
  }),
});
const adminCreate = await adminCreateRes.json();
const createdBookingId = adminCreate.booking?.id;
push(
  'POST /api/dashboard/bookings',
  adminCreateRes.ok && adminCreate.success === true,
  `bookingId=${createdBookingId}`
);

const targetBookingId = bookingId || createdBookingId;
const patchRes = await fetch(base + `/api/dashboard/bookings/${targetBookingId}`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify({
    status: 'CANCELLED',
    notes: 'Cancelada en QA',
    paymentMethod: 'MANUAL',
  }),
});
const patch = await patchRes.json();
push(
  'PATCH /api/dashboard/bookings/[id]',
  patchRes.ok && patch.success === true && patch.booking?.status === 'CANCELLED',
  `bookingId=${targetBookingId};status=${patch.booking?.status}`
);

const txRes = await fetch(base + `/api/dashboard/bookings/${targetBookingId}/transactions`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify({
    type: 'CHARGE',
    paymentMethod: 'MANUAL',
    amount: 12345,
    reference: 'QA-TX',
    description: 'Movimiento QA',
  }),
});
const tx = await txRes.json();
push(
  'POST /api/dashboard/bookings/[id]/transactions',
  txRes.ok && tx.success === true && Boolean(tx.transaction?.id),
  `transactionId=${tx.transaction?.id}`
);

const camperPatchRes = await fetch(base + `/api/dashboard/campers/${camperId}`, {
  method: 'PATCH',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify({
    pricePerDay: 15000,
    pricePerWeek: 100000,
    pricePerMonth: 430000,
  }),
});
const camperPatch = await camperPatchRes.json();
push(
  'PATCH /api/dashboard/campers/[id]',
  camperPatchRes.ok && camperPatch.success === true && camperPatch.camper?.pricePerDay === 15000,
  `pricePerDay=${camperPatch.camper?.pricePerDay}`
);

const logoutRes = await fetch(base + '/api/admin/logout', {
  method: 'POST',
  headers: { cookie },
});
const logout = await logoutRes.json();
push(
  'POST /api/admin/logout',
  logoutRes.ok && logout.success === true,
  `status=${logoutRes.status}`
);

const postLogoutDashRes = await fetch(base + '/api/dashboard', { headers: { cookie } });
push(
  'GET /api/dashboard after logout',
  postLogoutDashRes.status === 401,
  `status=${postLogoutDashRes.status}`
);

for (const item of results) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'}|${item.name}|${item.detail}`);
}

const failed = results.filter((item) => !item.ok).length;
process.exit(failed ? 1 : 0);
