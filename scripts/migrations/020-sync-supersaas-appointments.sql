-- SuperSaaS Relational Sync (2025-12-05T17:11:26.629Z)

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d8b6f8251faa2c2427639e8fcfd94e6c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'bonolo', '', 'modise', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c2c44ce7cb1bfb8d745067be3e442b0f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd8b6f8251faa2c2427639e8fcfd94e6c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-21T10:00'),
  'confirmed',
  '',
  '9400818',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('34b3a40755cafb6e3a02eebeb1be2d42', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Celia Mnguni ', 'mngucelia5@gmail.com', '0720696673', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'efd5dc33d45a9a37b6824c94d87b9a80',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '34b3a40755cafb6e3a02eebeb1be2d42',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-21T11:00'),
  'confirmed',
  '',
  '9412351',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4a1b5db2c7885e0bec67b218f7619735', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sibongile ', 'sibongileb33@gmail.com', '0767441094', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '442b6db2025acd4293442ff6f5dd252d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a1b5db2c7885e0bec67b218f7619735',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-21T13:00'),
  'confirmed',
  '',
  '9415851',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a3cf383f875dc955e3c8b2332fd1a2ac', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bontle Motubatse', 'motubatsebontle@gmail.com', '0818937852', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ce037f5ea285c30adf2d7d9c66c8537c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a3cf383f875dc955e3c8b2332fd1a2ac',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-21T14:00'),
  'confirmed',
  '',
  '9414104',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fc0fb9b3316fb3d5975ad0ac1525fa66', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rapelang ', 'rapelangraps50@gmail.com', '0659480352', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '23666e393e39d36b776f478d60e558dc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-21T15:00'),
  'confirmed',
  '',
  '9413058',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b03160597827c7b5fe63de739584231f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele Langa ', 'zanelelanga46@gmail.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd1a79d17ea9bdc4c177418e4c4501872',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-22T09:00'),
  'confirmed',
  '',
  '9417526',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('87355dadad87e133469c5829606cdebe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lesego Ndhlovu', 'ndhlovumichelle1411@gmail.com', '0614721685', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '00a8d2e6d784a39b361d2f0217cc09a9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '87355dadad87e133469c5829606cdebe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-22T11:00'),
  'confirmed',
  '',
  '9412780',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'aefb1600d93ade6cdceefa3c8d7be5e9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-22T12:00'),
  'confirmed',
  '',
  '9406190',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a2ebaa7e500c4b9478e8a69aeb96f4c6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T09:00'),
  'confirmed',
  '',
  '9419978',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('71584128d496c9a9648c01b8421fe454', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kopano Motsepe', 'ratikopano6@gmail.com', '0715138920', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7ef9144a66f6c3ecb2a3607ecf80b604',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T10:00'),
  'confirmed',
  '',
  '9420621',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('251c67020350eb60746378ee88dd1dfe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Precious Tau', 'lptau17@gmail.com', '0662717406', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '89d3e76e27fe52a6bc671f7279056f20',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '251c67020350eb60746378ee88dd1dfe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T11:00'),
  'confirmed',
  '',
  '9335352',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('12de260c010b3db0b4537c11fe56b4ed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Valencia', 'valencia1mahlangu@gmail.com', '0817515797', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd72ae0c3a62b4489b402f17867d759b1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '12de260c010b3db0b4537c11fe56b4ed',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T13:00'),
  'confirmed',
  '',
  '9362499',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a3b0f779c5dad21ea6d8b82de06d5eff', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dimpho Moloto', '240332326@ump.ac.za', '0662641661', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ae789bcad7ee546182b0e3f53a218814',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a3b0f779c5dad21ea6d8b82de06d5eff',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T14:00'),
  'confirmed',
  '',
  '9418521',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('eb79d6b3ddb4dfbe38eadf09d8c09a9b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thuli', 'thulimn28@gmail.com', '0730302890', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '18d2e0f5dfa0074b547f8de489ce874e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eb79d6b3ddb4dfbe38eadf09d8c09a9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-23T15:00'),
  'confirmed',
  '',
  '9417484',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1e7f642c56959fd04e50aca1ae92e043', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kopano Leola', 'kopano.leola@gmail.com', '0730190347', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5772ad08b6ce1012358635bd89ed4cdb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1e7f642c56959fd04e50aca1ae92e043',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T09:00'),
  'confirmed',
  '',
  '9400254',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('814ce00af64956e403503b79ea6693fe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'dimakatso precious', '', '0798077079', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4abb3b569507f8f1128ff71a27ce9a2e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '814ce00af64956e403503b79ea6693fe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T10:00'),
  'confirmed',
  '',
  '9418035',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0b62c13e96fe2ea3eef82017dc392933', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maditlhare Moleme', 'moleme0604@gmail.com', '0714130452', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '36ee3de3ed8f712987a38dcbe0bad436',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T11:00'),
  'confirmed',
  '',
  '9401768',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fb9d68b7be9af21d956abf50de496b4a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lesego Gomba', 'lesego.gomba@gmail.com', '0763025639', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '809ffee09b05ff3ae26ecf870a94faae',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fb9d68b7be9af21d956abf50de496b4a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T12:00'),
  'confirmed',
  '',
  '9414946',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cc4509ec012cb16357d0475c7ae2530e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Cynthia ', 'cynthiandhlovu50@gmail.com ', '0838226275 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3fdf89201d3f8bec15c166847200b4a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cc4509ec012cb16357d0475c7ae2530e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T13:00'),
  'confirmed',
  '',
  '9419884',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('97c29382984fe4a33c394aa249cb363f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng Manala', 'nthabisengmanala96@gmail.com', '0766702499', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6c533f845f21a237437cd16ad58208d8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '97c29382984fe4a33c394aa249cb363f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T14:00'),
  'confirmed',
  '',
  '9400599',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('62ee698d1b3fccb9823188847e571a4e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshiamo Tlhabane ', 'boipelotlhabane8@gmail.com', '0672010014', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '75433af01f891cf11048e9110c725253',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '62ee698d1b3fccb9823188847e571a4e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-24T15:00'),
  'confirmed',
  '',
  '9400314',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d35a80409e6de46949a39830510c1548', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Katlego', 'katlinancym@gmail.com ', '0849546012 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '560ec37af09aadefc0a40fe76ff39c21',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd35a80409e6de46949a39830510c1548',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-27T09:00'),
  'confirmed',
  '',
  '9411882',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '198eeee345c2b7cb3925c5540cdfc988',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-27T10:00'),
  'confirmed',
  '',
  '9423322',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('63cbd81f1a007b31ee38f882b0fcfeb8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Entle Makhafola ', 'kamogeloentle34@gmail.com', '0739180525', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e774d9331c5983b332b09bfeb1978e1f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '63cbd81f1a007b31ee38f882b0fcfeb8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-27T11:00'),
  'confirmed',
  '',
  '9420629',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5cac9138155bd3f67afa02e72434fa3a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshegofatso', 'tshegofatsomorotoba@gmail.com', '0617808463', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8d5265f08eca7bab4a7975a53a365969',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5cac9138155bd3f67afa02e72434fa3a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-27T13:00'),
  'confirmed',
  '',
  '9423535',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fa43732a566163b42c11d14bdbd82803', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele', 'zanele.mabizela1@gmail.com', '0695313978', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '48afdf2f57481f9fabc287ed7653a9ef',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fa43732a566163b42c11d14bdbd82803',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-27T15:00'),
  'confirmed',
  '',
  '9423242',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7f52a9f22124a4ada9551157c1d13c59', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rejoyce Hlongwane ', 'rejoycehlongwane@gmail.com', '0795656023', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '28885c332512c768c60e53db3a3d67b7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-28T10:00'),
  'confirmed',
  '',
  '9400834',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '955dbc9af838eee9a057df480ff115cf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-28T11:00'),
  'confirmed',
  '',
  '9400849',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4b6b85ccdaae4d6f01f6d552c75ca118', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Katlego', 'katlinancym@gmail.com', '0849546012 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '47abf19c1f6d48446a6f4604bd700123',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4b6b85ccdaae4d6f01f6d552c75ca118',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-28T13:00'),
  'confirmed',
  '',
  '9415168',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7baadfc7488692929a9d374f43e1c539', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sakhile ', 'mahlangubahle708@gmail.com', '0695004908', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b287730ac8020bf361230c57a3bb0f29',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7baadfc7488692929a9d374f43e1c539',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-29T09:00'),
  'confirmed',
  '',
  '9422273',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fe38f30e852de8f1eab1f67e4851dcb7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Osiame', 'osiamemonesii@gmail.com', '0680700824', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4499f15431e3447e67cdee891950ea63',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fe38f30e852de8f1eab1f67e4851dcb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-29T11:00'),
  'confirmed',
  '',
  '9421841',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0e3218a532750e2cd85747b3ba82f34b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tsholanang', 'mahowatsholanang04@gmail.com', '0814757226', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '26e499621201dbeccbbd4fb07103a149',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0e3218a532750e2cd85747b3ba82f34b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2024-12-29T12:00'),
  'confirmed',
  '',
  '9391439',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b398eb20ffd1b25266e65a59a2672457', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bonolo Mphahlele', 'bonolo.mphahlele@icloud.com', '0792378015', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd93dda3b3c438df77240b95262a5488c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b398eb20ffd1b25266e65a59a2672457',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-10T15:00'),
  'confirmed',
  '',
  '9456658',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('27041a0800c0f802917648cc6db957a2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Yolanda ', 'kamfede@gmail.com', '0735628139', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a37ebbedb9ebdbbd1f1be489d08a8eae',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-11T11:00'),
  'confirmed',
  '',
  '9457206',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('be024d0e83b25a063c6dd617f013fab6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nonkululeko', 'nonkululekopelo14@gmail.com', '0659811965', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3762d98dffda52ec08f4b2775e0d97a5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'be024d0e83b25a063c6dd617f013fab6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-11T14:00'),
  'confirmed',
  '',
  '9457187',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('42bce78bbc217786b7357f662a5d97d5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Slindile', 'slindilentanzi20@gmail.com', '0720322396', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dd601663f70f71d3a8a6a0cab32554ef',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42bce78bbc217786b7357f662a5d97d5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-12T09:00'),
  'confirmed',
  '',
  '9458877',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('172acc287ea69d57a69d6d4750ca4497', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vanessa Ramogale', 'vanessaholerato1@gmail.com ', '0760281561', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '95f3355a4754bb3899babf5385ce43b2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '172acc287ea69d57a69d6d4750ca4497',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-12T11:00'),
  'confirmed',
  '',
  '9462486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bdfed9686d7949beed5e441273217c04', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Fortunate ', 'fortunatelebone5@gmail.com', '068 1100017', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1b905a7642b13f71cf269a84e0f7c974',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-16T10:00'),
  'confirmed',
  '',
  '9476881',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6471233a1e976be1ec4e162e0791b0f2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keamogetswe', 'keankiieykea12@gmail.com', '0685781328', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '26491a5de9c9f718b56cf0f04defd864',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6471233a1e976be1ec4e162e0791b0f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-16T14:00'),
  'confirmed',
  '',
  '9469093',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9721ea6836904392cb5d53a4079c9cae',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6471233a1e976be1ec4e162e0791b0f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-17T09:00'),
  'confirmed',
  '',
  '9469918',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '76f7e9ddaa85d31e9e409779f546700f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-17T10:00'),
  'confirmed',
  '',
  '9476033',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a099838665086819626bdafdc3415f99',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-17T11:00'),
  'confirmed',
  '',
  '9479453',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('38a31aa813f3da1dec9b4900967c062e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thokozile Tk Radebe', 'thokoziletk40@gmail.com', '0695151080', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2cddd554d835fc2b2ee79eab9ca9b303',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '38a31aa813f3da1dec9b4900967c062e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-17T13:00'),
  'confirmed',
  '',
  '9480742',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '432d88253aa8abb5a571b67def64639e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-17T15:00'),
  'confirmed',
  '',
  '9478048',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c5aeb37ef6f921ef129d3055fdff4ece', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Belinda ', 'btsithole5@gmail.com', '0713461500', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a3264182f5ced53e3f8a2abcd64e182f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c5aeb37ef6f921ef129d3055fdff4ece',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-19T09:00'),
  'confirmed',
  '',
  '9465359',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9ab095f9232cda57df844ae492776295', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Olerato', 'aobakwe.modise@icloud.com', '0682457669', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '806f10030a0c922bcf4dcd181bb803ab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9ab095f9232cda57df844ae492776295',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-25T10:00'),
  'confirmed',
  '',
  '9501063',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('de8bab725160f59832e7cdcceca23da9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Senzeni Marcia', 'marciasenzeni@gmail.com', '0810950971', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0d9bd67c2426b0f936c16503e9fb79f9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-25T11:00'),
  'confirmed',
  '',
  '9500171',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4322d03766cb09d6438a720606e4a0c2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-25T15:00'),
  'confirmed',
  '',
  '9502689',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e6ed578ca3cbf5fbd353d37ffe3c4031',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-26T09:00'),
  'confirmed',
  '',
  '9500757',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1e46dfce0f05a05a21ca3f1c7620dc17', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Oratile Mngoma', 'oratilemngoma@icloud.com ', '0724712995', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1720e0cf7a27a2d5c4cfa4b08c023e5d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1e46dfce0f05a05a21ca3f1c7620dc17',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-26T11:00'),
  'confirmed',
  '',
  '9503469',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9955abc23eb415ba156a96912f223246', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nkhensani ', 'khensani55@gmail.com', '0783408466', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '146a1f4853971bb06dda8919f2c9fa17',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9955abc23eb415ba156a96912f223246',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-26T12:00'),
  'confirmed',
  '',
  '9503825',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6b589d999886bf2a3426181d4c577706', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Neo Selemela ', 'nselemela@icloud.com', '0738053527', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c41b66be88fe5030dd07a2d9e8f14441',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-30T10:00'),
  'confirmed',
  '',
  '9507381',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e08006657274d340dd18a569571207c3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reitumetse ', 'rmatsoha@gmail.com ', '0763516668', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7e87d1a07f1c3a96d0fa67fa470ca23d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e08006657274d340dd18a569571207c3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-01-31T09:00'),
  'confirmed',
  '',
  '9509208',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'db453c40e7d73e81a57e929efe21413a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-01T11:00'),
  'confirmed',
  '',
  '9513595',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4e7db1a597ad5f2176d7800125e10dd2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Samukelisiwe ', 'ndlelas75@gmail.com ', '0788371368', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '073907b0241a993e42f13d28257dd991',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4e7db1a597ad5f2176d7800125e10dd2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-01T13:00'),
  'confirmed',
  '',
  '9519576',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6847446f49214ad546fa8e93da3c7cac',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a1b5db2c7885e0bec67b218f7619735',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-01T14:00'),
  'confirmed',
  '',
  '9521574',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '002f96fd3dac922edb51fb58339d5688',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-01T15:00'),
  'confirmed',
  '',
  '9522225',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d689efdc926efaf1167f8e30366d26fe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vanessa Ramogale', 'vanessaolerato1@gmail.com ', '0760281561', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a05edcafee6e47b1a877f83bb0e61aa3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd689efdc926efaf1167f8e30366d26fe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-02T11:00'),
  'confirmed',
  '',
  '9523323',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2c1c9bad67dacc5a703b2ed841f4f960', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Imi Bingwa ', 'ntokozo.bingwa@gmail.com', '0783499929', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9df328f60915369c57b8d4707eca3239',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2c1c9bad67dacc5a703b2ed841f4f960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-02T12:00'),
  'confirmed',
  '',
  '9522246',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7b00c4558a630dbb7df068cd2444e4ed',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-07T09:00'),
  'confirmed',
  '',
  '9537672',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('41cc910e5228e0dd77ef1700da23d059', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tsholofelo Boikhutso', 'tsholofelokellyb@gmail.com', '0813755505', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f882a1c107c2b27aa5ffb629e4bb55c4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '41cc910e5228e0dd77ef1700da23d059',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-07T14:00'),
  'confirmed',
  '',
  '9524928',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '95797a01d583c96b50241e5fffc49984',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-07T15:00'),
  'confirmed',
  '',
  '9534784',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0c5d44f50101070b51ef9cf0d33154a5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshepang motjeng ', 'tshepangmotjeng@icloud.com', '0673293492', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '81322afe77076a040a07d9c954b612d0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0c5d44f50101070b51ef9cf0d33154a5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-08T13:00'),
  'confirmed',
  '',
  '9542479',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b1e4615db7fd2ed063c5a80a6c5d7240', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dimakatso ', 'dimakatsomangwane7@gmail.com', '0695400654', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8ad45c051be38316115ec69c4685c032',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-13T09:00'),
  'confirmed',
  '',
  '9538017',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ad3ba610b14104351d834db118636437', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Khumoetsile Podile', 'khumopodile@gmail.com', '0738202673', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'de716853dbf0622900b3553c047edb2c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ad3ba610b14104351d834db118636437',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-13T11:00'),
  'confirmed',
  '',
  '9554714',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('dd06006cbc6da7fc2a6514d5dffebe32', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vanessa Ramogale', 'vanessaholerato1@gmail.com', '0760281561', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b7499e542e0d94d1ab344bf3bf059d07',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'dd06006cbc6da7fc2a6514d5dffebe32',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-13T13:00'),
  'confirmed',
  '',
  '9556512',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1fbf021483d5fd29140660f57d0869c9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sharon', 'sharonmsiza@icloud.com', '0813018217', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '725b83256978cbb51ac5abe23365c42b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1fbf021483d5fd29140660f57d0869c9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-13T14:00'),
  'confirmed',
  '',
  '9538940',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e85d6068ffdfe8796cd3d4ff36a0494a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-13T15:00'),
  'confirmed',
  '',
  '9526312',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fd158adfa21ea6fa03e91cd3290d04d8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo skosana', 'karaboskosana84@gmail.com', '0634369877', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '371b472e430283543f71f6094e6faded',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fd158adfa21ea6fa03e91cd3290d04d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T09:00'),
  'confirmed',
  '',
  '9552105',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0ebda1ca8bbf23a5f93a95ed1124c3cd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T10:00'),
  'confirmed',
  '',
  '9545354',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('67886ba683a8d61d7c0f5e82b06dd245', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Naledi Malele', '', '0664202529', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7c8e534804ec612eb261a873c7eda765',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '67886ba683a8d61d7c0f5e82b06dd245',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T11:00'),
  'confirmed',
  '',
  '9524093',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d350a50f7b9e58501460b87ddb80c2a1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Motlalethabo ', 'hlomotlalethabo@gmail.com', '0660178779', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '950e44477c05896bb807d407ac7ce446',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd350a50f7b9e58501460b87ddb80c2a1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T13:00'),
  'confirmed',
  '',
  '9556814',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7c63b33a08d390c5cb20e1bba45456f9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lorraine ', 'lorrainesolana6@gmail.com', '0648233518', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7a3544799652d787d3dabcd7edd119db',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7c63b33a08d390c5cb20e1bba45456f9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T14:00'),
  'confirmed',
  '',
  '9557804',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6dea2385565bfe132e00cf399c5d14ce', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele Thulare Chauke', 'zazathulare1@gmail.com', '0655909980', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5f51ad4a763219b13c161c57b7a8cee9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6dea2385565bfe132e00cf399c5d14ce',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-14T15:00'),
  'confirmed',
  '',
  '9515191',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('95137f4169283f6d457f81b41854cd11', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'fikile', '', '0604251049', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3bc58b6febb67588a5460099531817e3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '95137f4169283f6d457f81b41854cd11',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-15T10:00'),
  'confirmed',
  '',
  '9546046',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f877475cfb3d5eaae66a9852754b47d9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6dea2385565bfe132e00cf399c5d14ce',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-15T11:00'),
  'confirmed',
  '',
  '9521204',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('67bddfad4db3a507ee000132692fda58', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Njabulo', 'gogomjabulo@gmail.com', '0720108006', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2f86139dc788c176158500848379f7f5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '67bddfad4db3a507ee000132692fda58',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-15T13:00'),
  'confirmed',
  '',
  '9560757',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5f8f8121b014fb303110bd9d6cef67ea',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-15T14:00'),
  'confirmed',
  '',
  '9549980',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('16ac9495abba3ae094023816aef2c549', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keatlaretse Makapela ', 'kmakapelakea@gmail.com', '0742298792', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f83e9f421dccba5321bd9ef882a7037b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-15T15:00'),
  'confirmed',
  '',
  '9554863',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '616e3ed119b5c013a6c60c896b37de31',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-16T09:00'),
  'confirmed',
  '',
  '9558329',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('89e0bde415f3bc8b02adab6da1a6a299', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tsholofelo Modisa', 'akamaia799@gmail.com', '0738041020', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '285b5d18d731face9e433b530e52839f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '89e0bde415f3bc8b02adab6da1a6a299',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-16T11:00'),
  'confirmed',
  '',
  '9544232',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cbc28bfa2b3ed31693e693a673fcdbae', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sibongile dinah nkuna', 'bonginkuna88@icloud.com', '0729259378', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6971ae011387ed61ab5b5018378cade9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-16T12:00'),
  'confirmed',
  '',
  '9553127',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '423dda14ea79fd7820832d9ab6486b0a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0c5d44f50101070b51ef9cf0d33154a5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-17T14:00'),
  'confirmed',
  '',
  '9564487',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('86b15ad9b0b238662792fafbd8228498', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thato', 'thatokomako@icloud.com ', '0672228400', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '98d6cdbad48e152b075f40e3468b3023',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86b15ad9b0b238662792fafbd8228498',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-20T09:00'),
  'confirmed',
  '',
  '9560708',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a8b2994d427c60b82e1f0bcd1bd3144d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'bathabile nkabinde', 'bathabile.k08@gmail.com', '0827563060', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4fb4a306f51a484ffaef48efe8297b00',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8b2994d427c60b82e1f0bcd1bd3144d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-20T13:00'),
  'confirmed',
  '',
  '9561232',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8685dde5b5d32df60668b53673c1fa70',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-21T09:00'),
  'confirmed',
  '',
  '9577299',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3cb06a6348ad1a9ed666321e526d1ebd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-21T10:00'),
  'confirmed',
  '',
  '9577771',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('71e80c56bf03740f4d1ea2aec9311101', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mpho', 'mphochauke2908@gmail.com', '0723192914', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cabd13fb38909a4e050ea62626e2af7f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71e80c56bf03740f4d1ea2aec9311101',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-21T13:00'),
  'confirmed',
  '',
  '9577891',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2bb0bbe3ae30f2ae2d559ed853c6098c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'dd06006cbc6da7fc2a6514d5dffebe32',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-22T11:00'),
  'confirmed',
  '',
  '9581441',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'feca1f3e2e6f9f3fe621343156b57c1f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-23T12:00'),
  'confirmed',
  '',
  '9581230',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8a87fbae63b31df2de7092393e09b2e2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a1b5db2c7885e0bec67b218f7619735',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-27T09:00'),
  'confirmed',
  '',
  '9592415',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4a8082b779e2dd1dec8ae9c5ddaf5559', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keamogetse Phathela', 'keamogetsephathela@icloud.com', '0683889085', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b7378bfbdb8fe3873977c6c82f2e9933',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-27T15:00'),
  'confirmed',
  '',
  '9585174',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('43f0eedb05cee540330fc970cfedc3d9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Makua Malebo', 'malebosehlage@gmail.com', '0712624338', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e43b932a978e3ff85c563bef8e98afdd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '43f0eedb05cee540330fc970cfedc3d9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T09:00'),
  'confirmed',
  '',
  '9597073',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9925e19d920ec583f943785a53256fac',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T10:00'),
  'confirmed',
  '',
  '9597175',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('09fb1ebcd52769caeadc5abf5bd9a330', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshifhiwa ', 'onthatilemillie@gmail.com', '0607207971', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '33f13bbdc16bbd21baceea6d39f3e861',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09fb1ebcd52769caeadc5abf5bd9a330',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T11:00'),
  'confirmed',
  '',
  '9596022',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6de3fbc1cc40170d855b87c863427313',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd350a50f7b9e58501460b87ddb80c2a1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T13:00'),
  'confirmed',
  '',
  '9592555',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0b16bc1bb6fa90d2807f51a6daa930d4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Precious Ramabina', 'petuniar@hyundai.co.za', '+27 73 905 7022', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4dbe8a016c58953cd4a67bc67e1eb9fa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T14:00'),
  'confirmed',
  '',
  '9590915',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bf81ddb3f3d5cea18af2dae1106e958a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-02-28T15:00'),
  'confirmed',
  '',
  '9572134',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('35c7cabfd61acf5579ff8d84d9150a6f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ethel', 'ethelhlapa12@gmail.com', '0671818750', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c402c2adcdf746ba8bcba88086479c15',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-01T10:00'),
  'confirmed',
  '',
  '9584373',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('83cca02aa3e5a2f8cf0e9203b12ddd5d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Onthatile Motshabi', 'motshabionthatile25@icloud.com', '0609749467', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e549162bcb6398b327b09f9c4daf366a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '83cca02aa3e5a2f8cf0e9203b12ddd5d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-01T11:00'),
  'confirmed',
  '',
  '9597526',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bbb74f0108a5705a2e7424c80ae02737', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sonto Valencia Mashaba', 'svmashaba12@gmail.com ', '0711058581 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4b736758475e918b415502249510eb58',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bbb74f0108a5705a2e7424c80ae02737',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-01T13:00'),
  'confirmed',
  '',
  '9597404',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '40a90ece09f8ee4a88b8b25cc61c8c89',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-01T14:00'),
  'confirmed',
  '',
  '9602810',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3b578663042280f65b40e6cdce5948a8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-02T09:00'),
  'confirmed',
  '',
  '9599637',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0e02460f2aeb9a3d18b78c5cf0c484a0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-02T11:00'),
  'confirmed',
  '',
  '9599706',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '95ba77cbeed7201fe98e5e806620012d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6dea2385565bfe132e00cf399c5d14ce',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-02T12:00'),
  'confirmed',
  '',
  '9582708',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3254d275d71d8b185c14436dc48ec90f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Muneiwa ', 'muneiwamudau303@gmail.com ', '0619973681', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '195862bf59193d9db96ced6ee972e688',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3254d275d71d8b185c14436dc48ec90f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-06T11:00'),
  'confirmed',
  '',
  '9593090',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bfc1903c56c8d2da95ca07654c8e01a3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thato ', 'thatokomako@icloud.com', '0672228400', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '38a324114f11b1dc420cfe586953b978',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bfc1903c56c8d2da95ca07654c8e01a3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T09:00'),
  'confirmed',
  '',
  '9610741',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d9906c3de7b37e8676ec35ebdba374e7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maserame ', 'jacolineleshabela08@gmail.com', '0848832678', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4ea4533c411729b82a3024004098bc7c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd9906c3de7b37e8676ec35ebdba374e7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T10:00'),
  'confirmed',
  '',
  '9613165',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd5139c108d582047faf173937c0f46fa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T11:00'),
  'confirmed',
  '',
  '9601677',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0153cac0cf2c4eaa26e37be8f5f169dd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T13:00'),
  'confirmed',
  '',
  '9614549',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b94ebe85c8b4a30d757234c1c409c4d5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandolwethu ', 'thandomazibuko63@gmail.com', '0813564615', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6b10ed065ead5fbcd1e3b13a40dbacb3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b94ebe85c8b4a30d757234c1c409c4d5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T14:00'),
  'confirmed',
  '',
  '9612360',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '03571b2d426ce17e573c958d18d5cea8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-07T15:00'),
  'confirmed',
  '',
  '9590145',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e0f7cb8ca2fd6870c14ba69c73885207', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kitso', 'pridemorulane@icloud.com', '0726840136', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd7e52a041abccf1f9c9b17126ae284b3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e0f7cb8ca2fd6870c14ba69c73885207',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-08T10:00'),
  'confirmed',
  '',
  '9609404',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('14d10bcca97261a8ee381998b755766c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thato ', 'thatobusakwe67@gmail.com', '0685251446', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4f45d168a0f52b7fac32ddc76ed4cf40',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '14d10bcca97261a8ee381998b755766c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-08T11:00'),
  'confirmed',
  '',
  '9615608',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7909ee08b93827e4ee20a5de3bf2cf01', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noluthando', 'mndebelenoluthando07@gmail.com', '0791187560', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6cdbb7c3754762cf5123d73a366d8835',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7909ee08b93827e4ee20a5de3bf2cf01',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-08T13:00'),
  'confirmed',
  '',
  '9621105',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2204c810248cc68adec787c154d61b50',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-08T14:00'),
  'confirmed',
  '',
  '9621211',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '332ff5ede24909075b15bc703cadb78d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-09T09:00'),
  'confirmed',
  '',
  '9621562',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd94a7ee5b2d1e9b2fbd52465e086dcfd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-09T12:00'),
  'confirmed',
  '',
  '9622943',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7c6f236f3de603e8ed5688928a511938', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nicole Maubane ', 'nicolemaubane1996@gmail.com', '0732114277', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cd56689b52ec8e8831634eb22660afec',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7c6f236f3de603e8ed5688928a511938',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-14T13:00'),
  'confirmed',
  '',
  '9637759',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '086f591af17742fe290c54b3d437b262',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-15T10:00'),
  'confirmed',
  '',
  '9643486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3ea3d1537633c4a48a9f889a386bd656', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Letlhogonolo ', '', '0812062744', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '31338714d3a45cbb4cca6e0635c6c71f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3ea3d1537633c4a48a9f889a386bd656',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-15T15:00'),
  'confirmed',
  '',
  '9624118',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('876dbb3a3d3560642d26e9520eccf141', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thapelo', 'thapschokoe009@gmail.com ', '0729219762 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e9954b35f8480bca5d05366a96ee1adb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '876dbb3a3d3560642d26e9520eccf141',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-20T10:00'),
  'confirmed',
  '',
  '9617913',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d6a46f0aef0519d0e7d08734ef5b7d9b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lethabo ', 'lb.motau@gmail.com', '0722739247', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c87bb44a0c069bb4ca714f7a3ec76a7c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-20T13:00'),
  'confirmed',
  '',
  '9654852',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2b21df6fc83ac23a0f93f635de83f0d0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T09:00'),
  'confirmed',
  '',
  '9660239',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('575180003ee6f767e5c91288b1825e7e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kgomotso Mokgothu ', 'motsomokgothu@gmail.com', '0792818878', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fc9f812271232aa76752ac700ce1e22c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '575180003ee6f767e5c91288b1825e7e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T10:00'),
  'confirmed',
  '',
  '9660515',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b726e1d9e4b9366b6a8309974fdea712',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T11:00'),
  'confirmed',
  '',
  '9659615',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('86ad23ea0f7e984564832e2720551593', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nkateko ', 'nkatekomatjokane.nf@gmail.com', '0658965740', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c7bce22c4b4a5f6cc4be695495506733',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86ad23ea0f7e984564832e2720551593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T13:00'),
  'confirmed',
  '',
  '9658199',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '602dc5509fddda8477a45150c116700b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '83cca02aa3e5a2f8cf0e9203b12ddd5d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T14:00'),
  'confirmed',
  '',
  '9659803',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b964fd84131b254aa2e826e588948483', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Katlego Mashala', '', '0685105504', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c5369312192124ac67fb6e8879b93670',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b964fd84131b254aa2e826e588948483',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-21T15:00'),
  'confirmed',
  '',
  '9598640',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '77a2177297b34378b96dcd19671bfa80',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-22T10:00'),
  'confirmed',
  '',
  '9645341',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f3f72597a305d2841243231ab181c675', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lebogang Masango', 'lebogangmasango96@gmail.com', '0680423573', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c5b7fa1eaf7c255bd91e51be94445592',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f3f72597a305d2841243231ab181c675',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-22T11:00'),
  'confirmed',
  '',
  '9654347',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4c1d175d1787f0a11026c43c64785ea8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntsako', 'mrsmntsako@gmail.com', '0640331922', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cb90ad8177361c2ce2ce76e23d93f267',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4c1d175d1787f0a11026c43c64785ea8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-22T13:00'),
  'confirmed',
  '',
  '9663530',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7aa98b53d7e510fe684119ccdfde82ed', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lilly', 'rapelangraps60@gmail.com', '0659480352', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'edb9f2ddc64d806a22d05c0e27adc6a0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7aa98b53d7e510fe684119ccdfde82ed',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-22T14:00'),
  'confirmed',
  '',
  '9660530',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('eeea6932243421e698b9ac58b32a532c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato ', 'msleratomaebana@gmail.com', '0736725536', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f334869631bccddf70bac6bca6f4e80b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eeea6932243421e698b9ac58b32a532c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-23T11:00'),
  'confirmed',
  '',
  '9656531',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '933c4e8969374aad43690d2930ba668f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0c5d44f50101070b51ef9cf0d33154a5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-24T09:00'),
  'confirmed',
  '',
  '9666008',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e7113e36972dd976820a52009ad52fc4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '251c67020350eb60746378ee88dd1dfe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-24T13:00'),
  'confirmed',
  '',
  '9665460',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('240c598aeb9b39743e24b0143bae8fb3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'thandazile', '', '0764816919', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c3ce8505b335e38c650a9aacc50e423f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '240c598aeb9b39743e24b0143bae8fb3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-27T09:00'),
  'confirmed',
  '',
  '9601934',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e120b7052c7fa13c5996dbadae47d933',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-27T13:00'),
  'confirmed',
  '',
  '9653677',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('974f50632608c2030de03127944368bb', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Atliey  client ', 'zanelelanga46@gmail.com ', '0647696159 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e5464addba3e45c6579289f6e8e840e9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '974f50632608c2030de03127944368bb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-27T14:00'),
  'confirmed',
  '',
  '9678626',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fcade5053f8154c6b622d7f13b443571',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-27T15:00'),
  'confirmed',
  '',
  '9639777',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('33d237e569875cfc60f0a0302e92bc88', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thembelihle', 'lihlemdhluli04@gmail.com', '0670715325', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '83cb892c10c8a58fd52b82c8f558a5f8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '33d237e569875cfc60f0a0302e92bc88',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T09:00'),
  'confirmed',
  '',
  '9664294',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5cf2111045fed899448497cd1ddabdd9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomcebo Ndebele', 'cebonarh@gmail.com', '0727952050', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '370c2242f25b9de0e62a58b8805d65e0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5cf2111045fed899448497cd1ddabdd9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T10:00'),
  'confirmed',
  '',
  '9669549',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7805e92af56d26a8ff7597d55b203816',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T11:00'),
  'confirmed',
  '',
  '9679171',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9151cfd425cbd82bbb2271440280942c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Boipelo', 'phokuboipelo@gmail.com', '0788809198', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4edcf7395f3fcaa98c5bae93b854409b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9151cfd425cbd82bbb2271440280942c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T13:00'),
  'confirmed',
  '',
  '9678026',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e6b60ee8ed3fd984fcb65ecf22aa1d63',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T14:00'),
  'confirmed',
  '',
  '9673874',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f1247efd9a64b3683499df5125c8fae4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kgothatso', 'albertinahkgothatso4@gmail.com', '0659700888', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fc486951d530e27f60de5968148d2747',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f1247efd9a64b3683499df5125c8fae4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-28T15:00'),
  'confirmed',
  '',
  '9664714',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3b0f9b910350b947c59b5eb106a78f76', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reneilwe  Rapoo', 'reneilwer15@gmail.com ', '0665672574', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9d9b62699ff7a0ca112816602cf3bc96',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3b0f9b910350b947c59b5eb106a78f76',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-29T10:00'),
  'confirmed',
  '',
  '9684102',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('17ead54cb4bf6520882a425575002600', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshepiso ', 'tshepisomatsane20@gmail.com', '0637248223', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '94875b92e08bc218a22a454120555046',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '17ead54cb4bf6520882a425575002600',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-29T11:00'),
  'confirmed',
  '',
  '9680520',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8671a8cfbed7befd209a03f44e1e9c85', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Letlhogonolo Letswalo', 'letlhogonololetswalo23@gmail.com', '060 573 3798 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '223ff726c732488316708e147d2a8168',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8671a8cfbed7befd209a03f44e1e9c85',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-29T13:00'),
  'confirmed',
  '',
  '9683996',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7b71be69f5bc3a5ab8025ff9007bf1a1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng Shikwambane', 'shikwambanenthabiseng90@gmail.com', '0685509293', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f59858c08006222a1e89ae0bec428439',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7b71be69f5bc3a5ab8025ff9007bf1a1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-29T14:00'),
  'confirmed',
  '',
  '9684120',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9ee6affca1915d8c8a03f38092c06051',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '575180003ee6f767e5c91288b1825e7e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-29T15:00'),
  'confirmed',
  '',
  '9681813',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '836d90c06ed58507bf381a180ca4856b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-30T09:00'),
  'confirmed',
  '',
  '9680011',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5a04cd8d8eef7a110d0f374050642c92', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mary-anne Phiri', 'boitumelophiri855@gmail.com', '0792947232', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a3684f6a64f84e4aca06ae456340b8b1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a04cd8d8eef7a110d0f374050642c92',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-30T11:00'),
  'confirmed',
  '',
  '9649849',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cece5ede9b4d789cacec49823bb50925',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e08006657274d340dd18a569571207c3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-30T12:00'),
  'confirmed',
  '',
  '9684601',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2a8e36acf3fa077c9485e8c1126c1534', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thabisile Ntshakala ', 'ntshakabongi@gmail.com', '0618543155', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '28b9db74347d8eccfd424c5c94c17a97',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2a8e36acf3fa077c9485e8c1126c1534',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-31T14:00'),
  'confirmed',
  '',
  '9559305',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c2567d243404c3c5ab5f30a66b6f372c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Doreen', 'selowadoreen99@gmail.com', '0608557156', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c5c90343cbd53a1f54ed697602bd7aa2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c2567d243404c3c5ab5f30a66b6f372c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-03-31T15:00'),
  'confirmed',
  '',
  '9540764',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ee41b295ba80c8c06c1f398b20d4bb3c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ndamulelo ', 'ndamulelomashavhanduna2000@gmail.com', '0609060698', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '18666f22d695f58a04a9ee021efa4cb2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ee41b295ba80c8c06c1f398b20d4bb3c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-03T14:00'),
  'confirmed',
  '',
  '9613346',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd458386e37fcb31d98c7aa53b4edd7aa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fd158adfa21ea6fa03e91cd3290d04d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-03T15:00'),
  'confirmed',
  '',
  '9643410',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0b6d686c92396f04ccebdd6971fea815', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nokubongwa ', 'nokubongwapretty09@gmail.com', '0785585172', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '98667ba2038366b0ab849175b29988a3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b6d686c92396f04ccebdd6971fea815',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T09:00'),
  'confirmed',
  '',
  '9692350',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('12db7f907ce299126fd3ccdcc17af6c8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Basetsana ', 'britneymashego2@gmail.com', '060 703 7959 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '65e69d259f458e863515aba94234d082',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '12db7f907ce299126fd3ccdcc17af6c8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T10:00'),
  'confirmed',
  '',
  '9702593',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '27503347c1156230e9c9b8c5d2696d6d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T11:00'),
  'confirmed',
  '',
  '9700924',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1940296a4f6ecad4b19d3aa90ac3135d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T13:00'),
  'confirmed',
  '',
  '9699232',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6c14f1dcdb6671726f184fdaada3fda0', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nhlamolo', 'nhlamoloselepe@gmail.com', '0729060702', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1ba8fb4e6bf752d7d81e1e4c27815af6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c14f1dcdb6671726f184fdaada3fda0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T14:00'),
  'confirmed',
  '',
  '9698928',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ca8f2b9ef21926b85fe9c4fc2cf4d48d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tinyiko Mdluli', '', '0647026719', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd310bb0255ded2d63aec906c4be3fe22',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ca8f2b9ef21926b85fe9c4fc2cf4d48d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-04T15:00'),
  'confirmed',
  '',
  '9680543',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('42ea67e1ab8f98243a1b4c824584d9e4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Refilwe ', 'refilwelsie@gmail.com', '0822251585', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1a6c4ca82d3a52e275ebf1a3746aba3c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42ea67e1ab8f98243a1b4c824584d9e4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-05T10:00'),
  'confirmed',
  '',
  '9696435',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a6f50f318038f42dd86cd9288bb8b921', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pfunzo Thangavhuelelo', 'pfunzothangie@gmail.com', '0648645581', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e1d4741472172120bbed9b2f4f6606ec',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a6f50f318038f42dd86cd9288bb8b921',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-06T09:00'),
  'confirmed',
  '',
  '9655540',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a7492d8b2e5b5a6d80bd23af36996de8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'nkateko Rasemana', 'rasemanankateko@gmail.com', '0715849487', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a5774fa3278f39ae5bd45d0a45ceb5f5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a7492d8b2e5b5a6d80bd23af36996de8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-06T11:00'),
  'confirmed',
  '',
  '9702707',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7bc742bb035e4f685ec44fc9d21921df', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'matlhodi', '21tlhoks@gmail.com', '0763221961', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ab95d8bb93a051762b8584d634ad33e5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7bc742bb035e4f685ec44fc9d21921df',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-06T12:00'),
  'confirmed',
  '',
  '9707090',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'efe598758c8e253bd404aed566e3fa03',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-07T10:00'),
  'confirmed',
  '',
  '9708193',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fe17bdf44dbef7aaf63d78390d044b08',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-07T15:00'),
  'confirmed',
  '',
  '9694424',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6eb4a51149c8adcf395c5dc51f703bff', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshegofatso ', 'tshegofatsonozipho@gmail.com', '0681728486', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '895e092f7aa33f17627dc399868b0e85',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6eb4a51149c8adcf395c5dc51f703bff',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-10T09:00'),
  'confirmed',
  '',
  '9708181',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '48c9338343b042d32b4e5d58c4940a66',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'dd06006cbc6da7fc2a6514d5dffebe32',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-10T10:00'),
  'confirmed',
  '',
  '9719924',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cc4495f6d53f8ea57948035d44adf869', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sibongile ', 'ceebongile@icloud.com', '0721959419', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8d6a8342e37a64db041561281d432888',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cc4495f6d53f8ea57948035d44adf869',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-10T11:00'),
  'confirmed',
  '',
  '9691855',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('640462273296c20fb93ebbcba3c2b87c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'rethabile', '', '0712615340', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '68b64452d6cf536f275d9d0fd9de6c25',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '640462273296c20fb93ebbcba3c2b87c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-10T13:00'),
  'confirmed',
  '',
  '9686294',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6c636abcc21b33b23f1f177a9184ca81', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Muneiwa ', 'muneiwamudau303@gmail.com', '0619973681', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '68e4a2d7477757483af17c916f870aca',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c636abcc21b33b23f1f177a9184ca81',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-10T14:00'),
  'confirmed',
  '',
  '9721198',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f3f9f449f9e3a02e68703f6a105ef8aa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c5aeb37ef6f921ef129d3055fdff4ece',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T09:00'),
  'confirmed',
  '',
  '9719027',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b3d493387caebf33c082ccc1fdbeaff4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng nkitseng', 'keamogetselebese@gmail.com', '0615159341', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74a8f937a947610d7a7ecbfb2f358c40',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b3d493387caebf33c082ccc1fdbeaff4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T10:00'),
  'confirmed',
  '',
  '9711591',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd3bda6a09ec105c248c6e8d23102d688',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6eb4a51149c8adcf395c5dc51f703bff',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T11:00'),
  'confirmed',
  '',
  '9683637',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '55750dd3c8fbeb75d9081cae885b7517',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T13:00'),
  'confirmed',
  '',
  '9724067',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f7b1dfc2433f22d5585a6c2d7dcc472d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nomthadazo ', '', '0769055224', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '87c67e4279e883ffdde7ac32541d80bf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f7b1dfc2433f22d5585a6c2d7dcc472d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T14:00'),
  'confirmed',
  '',
  '9723141',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9ab607b5a39aceb66fbaa48e53c74e3c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71e80c56bf03740f4d1ea2aec9311101',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-11T15:00'),
  'confirmed',
  '',
  '9725873',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a62c7399abb15885bdf2ad7a0ce11cb7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-12T10:00'),
  'confirmed',
  '',
  '9725010',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '15808c800b4469d2eeca1fcf37f6ea12',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f3f72597a305d2841243231ab181c675',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-12T11:00'),
  'confirmed',
  '',
  '9707772',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f05d5be183127e25a9b6d0f50e81b6b0', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vanessa ', 'vmaake0@gmail.com', '0671907617', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c4f1dbcf2dc1bf5bd7336fba7e43014c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f05d5be183127e25a9b6d0f50e81b6b0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-12T13:00'),
  'confirmed',
  '',
  '9727163',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d70e84b6f9678e3fd878a0feb7f57272', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Abigail Mokgatlhe', 'abigailmokgathle@gmail.com', '0730537807', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ab9416ce5c3b34d7445a98a5704a0261',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd70e84b6f9678e3fd878a0feb7f57272',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-12T14:00'),
  'confirmed',
  '',
  '9728854',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c7ea8e54cf8ed085811c022b6bf2580f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bonolo', 'nolomolenka@gmail.com', '0636309998', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6e16c6fb29bab99306f9cc1e55355ca6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-13T09:00'),
  'confirmed',
  '',
  '9728422',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e60c0140641cedd6b917c36ae3bd6572',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-13T12:00'),
  'confirmed',
  '',
  '9723803',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b682c002f3013ca96d6bbf69098f869b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshegofatso Molefe', '31470149@mynwu.ac.za', '0783343732', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '57d502232eea3ef5bf5daa161e621417',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b682c002f3013ca96d6bbf69098f869b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-14T13:00'),
  'confirmed',
  '',
  '9535310',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9a63f0c1c68fade662daa88f19524d0b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-14T15:00'),
  'confirmed',
  '',
  '9728810',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c7c594431ce1109a5297fd5adbf98539', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Samukelisiwe ', 'ndlelas75@gmail.com', '0788371368', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8288948289f93b65a1f2e70adbb743ac',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7c594431ce1109a5297fd5adbf98539',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-17T09:00'),
  'confirmed',
  '',
  '9741919',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1ea6a7c2cf8ffc5624fc1f00d3340915',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-17T11:00'),
  'confirmed',
  '',
  '9742059',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a7ae73e26b79a6b9dc69281efa55b465', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thembelihle Mncube', 'lihlemncube22@gmail.com', '0825018402', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2402afbf6b6c0c0622604af5a35c6d5a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a7ae73e26b79a6b9dc69281efa55b465',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-17T13:00'),
  'confirmed',
  '',
  '9733643',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '006cf653b93e24ab40d08385928cbc58',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-17T15:00'),
  'confirmed',
  '',
  '9736347',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '15fead79c5913ca1e0edb10aaaf1e5fb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ca8f2b9ef21926b85fe9c4fc2cf4d48d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T09:00'),
  'confirmed',
  '',
  '9734813',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '405e92c853ea5a096a6da5749c3cbae9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '974f50632608c2030de03127944368bb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T10:00'),
  'confirmed',
  '',
  '9730024',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3af39494f28d30b69a8df5c4991e94e4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T11:00'),
  'confirmed',
  '',
  '9745515',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fed9ac7acdd23ce375f4041e3ae05ff2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kedibone Matebula', 'ntina.mathebula@gmail.com', '0723968053', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '44f12a5c06ac9ef3fde41ac353ecec59',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fed9ac7acdd23ce375f4041e3ae05ff2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T13:00'),
  'confirmed',
  '',
  '9742820',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '265df9b0a6c830b9020a6d8d979e3670',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T14:00'),
  'confirmed',
  '',
  '9745522',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a2804b012cbdcfccba1004af610ce996',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-18T15:00'),
  'confirmed',
  '',
  '9746290',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a614a4dfef5dee06b5e62b252cc9670e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-19T10:00'),
  'confirmed',
  '',
  '9730956',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '26a7be395084c1fb986a73bb88448b00',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-19T11:00'),
  'confirmed',
  '',
  '9747891',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '865f72ebb6e978318249e389dc511ef5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-19T13:00'),
  'confirmed',
  '',
  '9740712',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '52326105f7f6918b15a6385c395aa289',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-19T14:00'),
  'confirmed',
  '',
  '9701089',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ca2e1b4da875ddaf79288a79c0022f6e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0c5d44f50101070b51ef9cf0d33154a5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-19T15:00'),
  'confirmed',
  '',
  '9747021',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b2cb14b54893845457364f86087356b3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-20T11:00'),
  'confirmed',
  '',
  '9747405',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd344e0066afd6646db6f500e1a976fab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a04cd8d8eef7a110d0f374050642c92',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-20T12:00'),
  'confirmed',
  '',
  '9737833',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4236f1b9a0b9bb66f5329aae45e393a5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-21T13:00'),
  'confirmed',
  '',
  '9730554',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('85de1a1bbb8e119c922e40c546963896', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Puseletso ', 'jeanettepuseletso30@gmail.com ', '0658776897', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6056810622b1a99f573d3d793548c9b3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '85de1a1bbb8e119c922e40c546963896',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-21T14:00'),
  'confirmed',
  '',
  '9750657',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4ddfb1b6f210a6b13aa3e8d1257b5c2f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-24T13:00'),
  'confirmed',
  '',
  '9748970',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('24db0df0f3f2782fc9effd3f6d50e74a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mantsadi Matlangwe', 'elizabethmatlangwe@gmail.com', '0710202169', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a74e08875d5182673e91ba6ffea0d5d9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24db0df0f3f2782fc9effd3f6d50e74a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-24T14:00'),
  'confirmed',
  '',
  '9749211',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1973c43113d21d4c007053f761475484',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-25T09:00'),
  'confirmed',
  '',
  '9763902',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a9d15b732fe973afffc3b6a99e2afeda', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Joyce ', 'fifilite3@gmail.com', '0730812840', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7b38292d101d4550830dc1eae72e8fb6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a9d15b732fe973afffc3b6a99e2afeda',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-25T10:00'),
  'confirmed',
  '',
  '9764396',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('dd1466ca98ea38e5a4c99fc5f6656436', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nokuthula Mabena', 'mabenanokuthula41@gmail.com', '0664255716', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '95a5a8b70588ba13afc1e6e441f94b0c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'dd1466ca98ea38e5a4c99fc5f6656436',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-25T14:00'),
  'confirmed',
  '',
  '9757744',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '256df7ad4d7a8ea70ef46fa49ee11a39',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-25T15:00'),
  'confirmed',
  '',
  '9749897',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('81d7de9e21813afc5542dbe7cdf13e78', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'sinethmba Queen maphanga ', '', '+27764492790', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '99b6d8c49ea65ab9e8599a3ccb864791',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '81d7de9e21813afc5542dbe7cdf13e78',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-26T10:00'),
  'confirmed',
  '',
  '9763048',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2a15b07d4394b01b4a952e8d3acdf56c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-26T11:00'),
  'confirmed',
  '',
  '9765892',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0739c6e58886e237a0dba3aa0052304a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Fihliwe Neo’s Sister ', 'fihliwemaphanga@yahoo.com', '0649130263', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7e821f0ce0bc50d8fcb0adc8cca83d15',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0739c6e58886e237a0dba3aa0052304a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-26T13:00'),
  'confirmed',
  '',
  '9766541',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('42ef951297947e40464e7e6b5b1a6509', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Olerato ', '', 'Modise', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6df623c0f73f02eb57e40f6683986064',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42ef951297947e40464e7e6b5b1a6509',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-26T14:00'),
  'confirmed',
  '',
  '9767449',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c9d48138a01cefc6b1a91cd281d021b5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '67886ba683a8d61d7c0f5e82b06dd245',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-27T09:00'),
  'confirmed',
  '',
  '9705379',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('088eec6f089005db82a2ea617411f822', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pakiso', 'pakisomahlangu@gmail.com', '0606237188', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b74924d9304b54f49424bd58576363bc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '088eec6f089005db82a2ea617411f822',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-27T11:00'),
  'confirmed',
  '',
  '9767821',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5c3cd4504e350cf6acd4be25a41eecc6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Boikanyo ', 'boikanyonkoane22@gmail.com', '0660908746', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9c6c232f43520b9c62a6351268a8f4e1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5c3cd4504e350cf6acd4be25a41eecc6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-27T12:00'),
  'confirmed',
  '',
  '9767025',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '866df1738cd03135fe6ad8fee2f79ce7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f3f72597a305d2841243231ab181c675',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-28T09:00'),
  'confirmed',
  '',
  '9769302',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('de310bac54a80e6f502541f2393c5d0d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reneilwe', 'reneilwer15@gmail.com', '0665672574', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5715704dc8cc9e6af9cf3e0a01ad26a1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de310bac54a80e6f502541f2393c5d0d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-04-28T13:00'),
  'confirmed',
  '',
  '9770904',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '417ec5cbe55a05fd5e4fcf8bb34fe0b9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T09:00'),
  'confirmed',
  '',
  '9774660',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('34311d4775411666ed62b28d9d55c00c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Molebogeng Mawela', 'molebogengmawela7@gmail.com', '0780993005', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e098cd3c54b95edc6191727272125c0f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '34311d4775411666ed62b28d9d55c00c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T10:00'),
  'confirmed',
  '',
  '9780673',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fcc2886071ab7a31a3a8c764455b7622',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c5aeb37ef6f921ef129d3055fdff4ece',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T11:00'),
  'confirmed',
  '',
  '9769952',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('aca262867f63a60b66173c6820f0cef4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lungile', 'lungilenkabi03@gmail.com', '0727053879', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1b521f6c7ff50bc885f94dfae2a8b679',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aca262867f63a60b66173c6820f0cef4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T13:00'),
  'confirmed',
  '',
  '9748048',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '28dc79b47a26fd4da34783a4043cd423',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6dea2385565bfe132e00cf399c5d14ce',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T14:00'),
  'confirmed',
  '',
  '9768219',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c6e7d8d8fd33a374acdea6ada95b2948', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ncamisile ', 'tshabalalapulie@gmail.com', '0659948616', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bf8e2ad09ae0414ef108dca0d9dcd290',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c6e7d8d8fd33a374acdea6ada95b2948',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-01T15:00'),
  'confirmed',
  '',
  '9748038',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'aad705f01b62d365cfdc71899fe2fbeb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fd158adfa21ea6fa03e91cd3290d04d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-08T09:00'),
  'confirmed',
  '',
  '9790013',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '81878dafac9589cf509633ec80ac4c6b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7baadfc7488692929a9d374f43e1c539',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-08T13:00'),
  'confirmed',
  '',
  '9801480',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a700270e6f648f0bee246b600c95de5a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntsako ', 'nsovokhumalo7@gmail.com', '0658454126', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a20f5c8701b29a1df49ac4ed1fdd5a59',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a700270e6f648f0bee246b600c95de5a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-08T14:00'),
  'confirmed',
  '',
  '9804274',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0aaac34d5eb25d863139ea41a1c11d37', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Obakeng Motsemme', 'motsemmeobakeng@gmail.com', '0670066824', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f29c9f62fa334754dbded06940ffa514',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0aaac34d5eb25d863139ea41a1c11d37',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T09:00'),
  'confirmed',
  '',
  '9779369',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd425e093e5128e1703396094d1e92a59',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T10:00'),
  'confirmed',
  '',
  '9804963',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('073ae60c8e046cfe67849c5b847bfacf', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Theon Manzini', 'theontheon0@gmail.com', '0818499341', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '018ffceedc6fa56ebb8e2c3a34ea304c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T11:00'),
  'confirmed',
  '',
  '9802724',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bf66395d3953413ad95bbcfcf20cd7db', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Refilwe Makua ', '', '0721878267', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '51b5136b148e62225b36366c0f0a9d5b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bf66395d3953413ad95bbcfcf20cd7db',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T13:00'),
  'confirmed',
  '',
  '9802573',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b90f189b6943357cf0e77549e231d713',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e0f7cb8ca2fd6870c14ba69c73885207',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T14:00'),
  'confirmed',
  '',
  '9804654',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '615a33c6474122640d29f7b7534721f2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-09T15:00'),
  'confirmed',
  '',
  '9798553',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2249b4ff6f26a4021a4344d8637cf6a0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-10T10:00'),
  'confirmed',
  '',
  '9808633',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '99b62dae63e1b9321e1cde4f0e97387d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fe38f30e852de8f1eab1f67e4851dcb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-10T11:00'),
  'confirmed',
  '',
  '9810115',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ca580744626c31fd00ff1c85bc4295c9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6471233a1e976be1ec4e162e0791b0f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-10T15:00'),
  'confirmed',
  '',
  '9809307',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0ea1cf02c1bcac1919cdd7f4b492d1d1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ca8f2b9ef21926b85fe9c4fc2cf4d48d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-11T09:00'),
  'confirmed',
  '',
  '9805015',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '927f2cb59b4f77fed3bf404f6cb0f995',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-11T11:00'),
  'confirmed',
  '',
  '9805675',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cb15f6ee88618579fbd7d92a31d0821d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lehlogonolo Mogale ', 'kabinilehlogonolo@gmail.com', '0626039568', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9b80c3773f5b58858284816d0e75757e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cb15f6ee88618579fbd7d92a31d0821d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-15T10:00'),
  'confirmed',
  '',
  '9812558',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('876122779276f3bf155e1ebf9f5927ae', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dineo Mogale', 'dineokabini21@gmail.com', '071487959&', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4cdcf3ccdb7574c4af462d6d82dc6110',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '876122779276f3bf155e1ebf9f5927ae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-15T11:00'),
  'confirmed',
  '',
  '9812850',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('115f6d92c9a93444e98345df2e9b306b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lasty Mabaso', 'lastymabaso@gmail.com ', '0766887044 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '83137487a76317537c11819d6b163499',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '115f6d92c9a93444e98345df2e9b306b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T09:00'),
  'confirmed',
  '',
  '9826812',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e95362855f881eaf34f4fa772a0c8ea0', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bridget Matheane ', 'bridgettematheane@gmail.com', '067 028 1994 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '25ce0cf69f2860c5d5986f9267b46727',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e95362855f881eaf34f4fa772a0c8ea0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T10:00'),
  'confirmed',
  '',
  '9828288',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd68eada2c5c836af4b8d9d970c972b85',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T11:00'),
  'confirmed',
  '',
  '9828787',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2d1f7f73d09fa36c46cc37b9ab3c6d77',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T13:00'),
  'confirmed',
  '',
  '9827326',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0899777d17e4ccd0e6dc4022a8d2ef60',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T14:00'),
  'confirmed',
  '',
  '9829031',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('39245e194342978fe6fe0dae38136231', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Adelaide ', 'addymondlane2@gmail.com', '0729612802', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '37e46730e54f7fb162515aba847e828b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '39245e194342978fe6fe0dae38136231',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-16T15:00'),
  'confirmed',
  '',
  '9811669',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ca6c466a57c3412664759611d3800ab5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fed9ac7acdd23ce375f4041e3ae05ff2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-17T10:00'),
  'confirmed',
  '',
  '9822986',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8b25e7eabd0538ea093c4568f2693671', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato', 'leratomaepa32@gmail.com', '0680539442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4ac5b7e37b68d30e18a8f5fb76719063',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8b25e7eabd0538ea093c4568f2693671',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-17T11:00'),
  'confirmed',
  '',
  '9830936',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9eeb953dfbd70e5ad541ba3ab752c960', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pholosho moja', 'tsholomoja91@gmail.com', '0832049996', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ba619ad6eac23806580ae318d0b7c65c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9eeb953dfbd70e5ad541ba3ab752c960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-17T13:00'),
  'confirmed',
  '',
  '9832983',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1f5527a1d15b47634afbb05258032b6f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9eeb953dfbd70e5ad541ba3ab752c960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-17T14:00'),
  'confirmed',
  '',
  '9832979',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e686df5b56f59a4396e18430668ea109',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-18T09:00'),
  'confirmed',
  '',
  '9830688',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '84bb9ded7e01c2272da0c87c211be6a9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-18T12:00'),
  'confirmed',
  '',
  '9822906',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1a6ea020ee24bca37feb31d8248404f2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mmapula ', 'kegommapula@icloud.com', '0662525628', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '04e4d342eb68f1498db64930213fb857',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1a6ea020ee24bca37feb31d8248404f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-22T09:00'),
  'confirmed',
  '',
  '9823250',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '244c97644705cc22deddaa733d4e70f5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-22T10:00'),
  'confirmed',
  '',
  '9847312',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4878eadb9bc71d7f0778db1635926307', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'SBO', 'sibongilemaseko465@gmail.com', '0693921730', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8b1ffb6acda1d7fc509284f51602aca4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4878eadb9bc71d7f0778db1635926307',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-22T13:00'),
  'confirmed',
  '',
  '9846828',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f6284680dafd8f83cc0b76bab02f5487',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5cf2111045fed899448497cd1ddabdd9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T09:00'),
  'confirmed',
  '',
  '9849058',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6302cbb0cb5d91897e6d054a1f69b279',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T10:00'),
  'confirmed',
  '',
  '9851569',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '89280abb7d1a33bd8ebf00805cb4142e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b03160597827c7b5fe63de739584231f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T11:00'),
  'confirmed',
  '',
  '9850422',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7aa3d56b78bf8a332144b8344f6c011d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T13:00'),
  'confirmed',
  '',
  '9849428',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ccaaa24f1a98c1979140c11da2cab722', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Fikile shongwe', 'kgodisoshongwe@gmail.com', '0795666421', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '95d2814a779cfe501365b75a8d07c9c1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ccaaa24f1a98c1979140c11da2cab722',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T14:00'),
  'confirmed',
  '',
  '9842926',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('04f0c72b1f40f623115aa770de447e1f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo Makgoba', 'kay25273@gmail.com ', '0603496734', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '85b60e734a63e163691372b2478df50f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '04f0c72b1f40f623115aa770de447e1f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-23T15:00'),
  'confirmed',
  '',
  '9843065',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ddb6bdbf93025cd69f488fe582a71fb4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Koketso Stone', 'latitiastone@icloud.com', '0659445140', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd8d65823fd3228cf6e58ea0216a53c92',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ddb6bdbf93025cd69f488fe582a71fb4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-24T10:00'),
  'confirmed',
  '',
  '9844858',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fc4fa2b41719e9a5a1e10284ebf8fb41', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo', 'tibanenhlalala@gmail.com', '0634369877', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6774363662f8119559d6dfced983b3e2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc4fa2b41719e9a5a1e10284ebf8fb41',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-24T11:00'),
  'confirmed',
  '',
  '9854004',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('09f0c15fac936a9097a822b3aa5ff74b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Promise', 'promise.paralegal@gmail.com', '0713904069', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4d6886dee437296e812af0027c53f764',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09f0c15fac936a9097a822b3aa5ff74b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-24T13:00'),
  'confirmed',
  '',
  '9849100',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b34e22d9ec7a0d1d65a7460bf8c1ec0a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e0f7cb8ca2fd6870c14ba69c73885207',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-25T09:00'),
  'confirmed',
  '',
  '9854925',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('377296d2c4c944991ea719e3e26e987a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lebogang Manenzhe', 'lebogangmanenzhe@gmail.com', '0635140229', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cbfc94f09627d2152eacd6add17eb204',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '377296d2c4c944991ea719e3e26e987a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-25T11:00'),
  'confirmed',
  '',
  '9855583',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '63529259bb451cf14160ecd9c066d6b6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-25T12:00'),
  'confirmed',
  '',
  '9853276',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a7abbff454fe1a017b535110e09ba268',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-29T09:00'),
  'confirmed',
  '',
  '9861946',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b89e72d1c0276c758d9f4e1d3eb9da9a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nicole Seloma', 'selomanicole1818@gmail.com', '0766991507', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f88de3e8614b8d0d677d758f21bf57a2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b89e72d1c0276c758d9f4e1d3eb9da9a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-29T10:00'),
  'confirmed',
  '',
  '9868006',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('eecba32ccb06b556a200dce1df5223b4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Marcia', 'nkelemarcia123@icloud.com', '0603477704', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f1a9fc0b12c9d1e26d77ae4b853bbf7d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eecba32ccb06b556a200dce1df5223b4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-29T13:00'),
  'confirmed',
  '',
  '9867976',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fb96276e10d3753537966239fe0e31fe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thobeka ', 'mankosizoleka@gmail.com', '0718063013/0785012092', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2d4e330ed119aaaeab1d7ea2804d0cbd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fb96276e10d3753537966239fe0e31fe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-29T14:00'),
  'confirmed',
  '',
  '9869407',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ad7645268cf9271e0b6097282cad68fa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-29T15:00'),
  'confirmed',
  '',
  '9868095',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7cdfa4ecd2f9bd14cba6e27abf54f740', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Portia Lenyai ', 'portiamadzhie@gmail.com', '0848504294', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '248f98dedc3c2109d5ec19617b9a16fb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7cdfa4ecd2f9bd14cba6e27abf54f740',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T09:00'),
  'confirmed',
  '',
  '9858628',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2a2a988fe98a6641210ab84949301623',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T10:00'),
  'confirmed',
  '',
  '9864213',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b1d43aa2b0d5d0fd9ee149e223d24071',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T11:00'),
  'confirmed',
  '',
  '9857841',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e30e84830dcb4978951e31fe056acaf8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kopano Selepe ', '', '081 546 8520 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4781270fe3ade85658dc3eb9d878451f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e30e84830dcb4978951e31fe056acaf8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T13:00'),
  'confirmed',
  '',
  '9849353',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd972aa88518504ace3d3c2dfbbcf645b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '974f50632608c2030de03127944368bb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T14:00'),
  'confirmed',
  '',
  '9854125',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '97f99240c058dabaa0f41edeff515742',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-30T15:00'),
  'confirmed',
  '',
  '9818933',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c4336e3cebd5c2ee0de1b36f2d657d4e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo Makgoba', 'kay25273@gmail.com', '0603496734', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '47d9130497c5c7f2204ecd288500f240',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c4336e3cebd5c2ee0de1b36f2d657d4e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-31T10:00'),
  'confirmed',
  '',
  '9859239',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd2e2648fc2c5d4452bf07447099374a1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-31T11:00'),
  'confirmed',
  '',
  '9860236',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e67106c1df4287bb180c8692e918b99c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-31T13:00'),
  'confirmed',
  '',
  '9860261',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '587533deaac4cd8b1e8cca9043f3c11b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27041a0800c0f802917648cc6db957a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-31T14:00'),
  'confirmed',
  '',
  '9855957',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('20ff317ebe7bdf25adf0f699a997f0bc', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sakhile ', 'mahlangubahle708@gmail.com ', '0695004908', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2e83f2c12210c4b22fa233685b39bf7b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '20ff317ebe7bdf25adf0f699a997f0bc',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-05-31T15:00'),
  'confirmed',
  '',
  '9861597',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6382d038ad130d06a1b1d928b1b72e91',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1fbf021483d5fd29140660f57d0869c9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-01T09:00'),
  'confirmed',
  '',
  '9867901',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a362f12fa23b0736685b061b6ff7208d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato kekana', 'llerato724@gmail.com ', '0720785773 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8782aa9882dba893349083d5184e637d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a362f12fa23b0736685b061b6ff7208d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-01T11:00'),
  'confirmed',
  '',
  '9869119',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4da5fe46a33ff8bf3620fa63a527f3c8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '377296d2c4c944991ea719e3e26e987a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-01T12:00'),
  'confirmed',
  '',
  '9866472',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f7581b82fcd4e08734fe38182d91b3d8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Shirley Malepe ', 'shirleytshimangadzo84@gmail.com', '0726662041', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2f70403d181ead53aa95b2473fba3cda',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f7581b82fcd4e08734fe38182d91b3d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-02T09:00'),
  'confirmed',
  '',
  '9867944',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8adbe76ac15fa9bf8475f78a4ad300a4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lindokuhle', 'lindonkosi103@gmail.com', '0671379537', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fce45a3d9962e9ae69675f56bac02a5b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8adbe76ac15fa9bf8475f78a4ad300a4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-02T10:00'),
  'confirmed',
  '',
  '9875532',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('49d98956a6a21a0d11cf02c2c9bdda9a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keitumetse ', 'mentoor888@gmail.com', '0649086669', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5651743d145290beb193776d49546407',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '49d98956a6a21a0d11cf02c2c9bdda9a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-05T15:00'),
  'confirmed',
  '',
  '9892069',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6c74fad3a190f2606608d5ca20c1e4c0', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Khethiwe Khethiwe', 'khethi.naomi@gmail.com ', '0836936515', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd988dd2e8678289fc37a369cc39100b6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c74fad3a190f2606608d5ca20c1e4c0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-06T10:00'),
  'confirmed',
  '',
  '9889624',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '75b5e7c774dcdaa1467e85c6c31c2413',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-06T11:00'),
  'confirmed',
  '',
  '9880891',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('615c548ddcc53c8f3ff14cbe5ec4d601', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntombifuthi ', 'mdlulibrian59@gmail.com', '0813900943', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6a530f930178d77db6012793fa551053',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '615c548ddcc53c8f3ff14cbe5ec4d601',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-06T14:00'),
  'confirmed',
  '',
  '9894188',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '62460fc65a65b101b964f2f15e889a2a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-06T15:00'),
  'confirmed',
  '',
  '9883189',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3eff632ace6e726c48712a1cfe9f36a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-07T10:00'),
  'confirmed',
  '',
  '9869154',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '952161665a599c88c941096fe372966a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ddb6bdbf93025cd69f488fe582a71fb4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-07T11:00'),
  'confirmed',
  '',
  '9869884',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a00fbca0f0775b55dfd9a9a8f83630ad', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reabetswe ', 'reeyareabetswe@gmail.com', '073 537 5086', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b2246426406d50b221515fe52711abfc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a00fbca0f0775b55dfd9a9a8f83630ad',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-07T13:00'),
  'confirmed',
  '',
  '9895713',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f39297dd9221a55620eeec7e4faa3c29', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zaneleplanga', 'zanelelplanga@23.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '582ba869d958e063c9b00af778d98b83',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f39297dd9221a55620eeec7e4faa3c29',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-07T14:00'),
  'confirmed',
  '',
  '9896180',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'efa0a6bd76293cf7f0971a1c66445bc0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-09T10:00'),
  'confirmed',
  '',
  '9898004',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a771180d7e2498ffbd9b4c292451ecea', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele ', 'zaneleplanga@23.com.za', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd789f59794bf1734fda173d72b977882',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a771180d7e2498ffbd9b4c292451ecea',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-09T14:00'),
  'confirmed',
  '',
  '9899853',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'de43e4f67388da7e77e0549b7c4fb17c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T09:00'),
  'confirmed',
  '',
  '9903068',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bd5a1b07210aeaf0397a50377544bbf3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T10:00'),
  'confirmed',
  '',
  '9909981',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('77ce2d5cbe417ea738341f539a4d54c3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'nokuthula ', '', '0697816866', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'da4b9a1cc12465a1286b6c55e0c3baff',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '77ce2d5cbe417ea738341f539a4d54c3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T11:00'),
  'confirmed',
  '',
  '9877705',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fd7ce7928c06aeab8367a3dcf8b49086',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T13:00'),
  'confirmed',
  '',
  '9910105',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a8fc350f4427ee7a0dc394939f951af6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a700270e6f648f0bee246b600c95de5a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T14:00'),
  'confirmed',
  '',
  '9909680',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c7c8b6c300ccadb3ccc738400a2d9937',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-12T15:00'),
  'confirmed',
  '',
  '9903386',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6d758eff4ec89d93626ae077f757a2f4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T09:00'),
  'confirmed',
  '',
  '9909960',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5ef50ba7b94414cc53a763441d768a66',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9eeb953dfbd70e5ad541ba3ab752c960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T10:00'),
  'confirmed',
  '',
  '9911916',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '711b7195dd21180366c40a5b4d09cc2d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4878eadb9bc71d7f0778db1635926307',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T11:00'),
  'confirmed',
  '',
  '9911530',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0a9babd36986c4e1cefe7ce34f2a841b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thereza', 'therema.marema@icloud.com', '0685848406', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f6ef857faa4e8da71f380e9dbd8b7acb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0a9babd36986c4e1cefe7ce34f2a841b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T13:00'),
  'confirmed',
  '',
  '9901576',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d0e7fe4de9d9c4e97b3de4fe2e5168f2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lethabo Booysen ', 'refbooysen@gmail.com', '072 937 0177 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'be9458de261720e0a93693e0fe5182a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd0e7fe4de9d9c4e97b3de4fe2e5168f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T14:00'),
  'confirmed',
  '',
  '9846049',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4c2b6ac885957a03138b568777594d3a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd0e7fe4de9d9c4e97b3de4fe2e5168f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-13T15:00'),
  'confirmed',
  '',
  '9846072',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a5f5c6292570e1727c0731533ef1f593', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Winnie Mogotlane ', 'winniemogotlane@gmail.com', '0715687222', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '78caa83a78f272bcf420bee5de5e9367',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a5f5c6292570e1727c0731533ef1f593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-14T10:00'),
  'confirmed',
  '',
  '9901506',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2a9dc73b675ce15af590aee1c8e48db4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Catherine ', 'katarinacatherine11@gmail.com', '0608172144', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1993640416ac268b2b7ec462a42971f7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2a9dc73b675ce15af590aee1c8e48db4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-14T11:00'),
  'confirmed',
  '',
  '9908347',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d869c1f2d522c2208e70a6d27cc76a68', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nxobile ', 'nxobileprecious09@gmail.com', '0781505483', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '07462c173f123ac8be863a877a6875b8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd869c1f2d522c2208e70a6d27cc76a68',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-14T13:00'),
  'confirmed',
  '',
  '9916687',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2bb782ca06120817676480dc85f21055', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rorisang ', 'rorisangroro90@gmail.com', '0813656918', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6a52c287f921bfe7cb9d5beffa268c78',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2bb782ca06120817676480dc85f21055',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-14T14:00'),
  'confirmed',
  '',
  '9914237',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9b8defd45f92bcb5c4bfe5c95a94676a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mama pinky ', 'zanelelanga24@icloud.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '629361f2c87fc11c702c5cc8413c0526',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9b8defd45f92bcb5c4bfe5c95a94676a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-15T09:00'),
  'confirmed',
  '',
  '9913253',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c30f6d020072fa20a8e8147e7f477c20',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-15T11:00'),
  'confirmed',
  '',
  '9912050',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2f5553d5fc63f4266118968e011aaeea',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-15T12:00'),
  'confirmed',
  '',
  '9908881',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5be881edcfa155eecd162e9b30374569',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '12de260c010b3db0b4537c11fe56b4ed',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-16T11:00'),
  'confirmed',
  '',
  '9912044',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('35ef40d3db40e5f969bbfe400b8c0579', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng', 'nthabisengtshukudu@gmail.com', '0734579982', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '41a461c13f4b9a4f514d36d1da4c6568',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35ef40d3db40e5f969bbfe400b8c0579',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-16T13:00'),
  'confirmed',
  '',
  '9920937',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3b0b032df2b4590089d69ac1bbdbdef3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e0f7cb8ca2fd6870c14ba69c73885207',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-19T09:00'),
  'confirmed',
  '',
  '9917381',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7ca7941c3d112ed9e3286557dcd49703', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Neliswa Mpanza', 'neliswampanza03@gmail.com', '0829711860', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b1746a195f3db2aa27918eb281f3a2d4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7ca7941c3d112ed9e3286557dcd49703',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-19T14:00'),
  'confirmed',
  '',
  '9925773',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'baf832393e54d833363bf108f47e306b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-19T15:00'),
  'confirmed',
  '',
  '9925537',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'eb823ea1c8f66ac17712814c3893af69',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e0f7cb8ca2fd6870c14ba69c73885207',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-20T09:00'),
  'confirmed',
  '',
  '9748967',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('608904cf19288a95ead07c6f2c8b8a8d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo Sehwana ', 'karabosehwana@gmail.com', '0636598615', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3d5844f71395ee784ffd97f4cb3aed9d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '608904cf19288a95ead07c6f2c8b8a8d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-20T10:00'),
  'confirmed',
  '',
  '9915165',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '10c6857d57c8096e01badd9ff9d67d54',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0e3218a532750e2cd85747b3ba82f34b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-20T11:00'),
  'confirmed',
  '',
  '9915957',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1c43892633b33d786d13598f22a4e711', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dimakatso Simelane', 'simelanedimakatso3@gmail.com', '0794339758', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '65f128f28355a121dbec2857a428ec52',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1c43892633b33d786d13598f22a4e711',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-20T14:00'),
  'confirmed',
  '',
  '9928811',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7f284215a533177b9f885537b0202143',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7bc742bb035e4f685ec44fc9d21921df',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-21T10:00'),
  'confirmed',
  '',
  '9932404',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7577c6904aa3657107b6a8b53f1fbc7c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lindokuhle Precious ', 'kekanalindo01@gmail.com', '0673714376', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6449b22e22cdf3311ea10755618ddaa0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7577c6904aa3657107b6a8b53f1fbc7c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-21T11:00'),
  'confirmed',
  '',
  '9895810',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd649a979417fd826a2e256a0dff33a6b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '615c548ddcc53c8f3ff14cbe5ec4d601',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-21T13:00'),
  'confirmed',
  '',
  '9932707',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('30c2f67562164c3fbcfe1cb61baf4a52', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lilly ', 'zanelelanga@46.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0d79e0e0ef4a7f6f6235043a98dcc6e5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '30c2f67562164c3fbcfe1cb61baf4a52',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-21T14:00'),
  'confirmed',
  '',
  '9933283',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a7c75028999b6f0e3143a4b6bdd539ae',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7c594431ce1109a5297fd5adbf98539',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-21T15:00'),
  'confirmed',
  '',
  '9936212',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dac389eb8bda8e7e0ead2575f8b08f4d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '30c2f67562164c3fbcfe1cb61baf4a52',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-22T09:00'),
  'confirmed',
  '',
  '9930478',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f3b6a927e426265a0bbb54237f1885d0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-22T12:00'),
  'confirmed',
  '',
  '9931731',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '49ca88f01c2c0f5d339d99dfa7d1115f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7cdfa4ecd2f9bd14cba6e27abf54f740',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-23T09:00'),
  'confirmed',
  '',
  '9927796',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9227242efeb06ff33d4fa1fe2730a16c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-23T14:00'),
  'confirmed',
  '',
  '9939675',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('682baae43aa54c0c4d54f2d045db2abb', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Unity Moja', 'tsholomoja91@gmail.com ', '0832049996', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1ca8e63de940371e11138fe12529f19d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '682baae43aa54c0c4d54f2d045db2abb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-23T15:00'),
  'confirmed',
  '',
  '9939388',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '46bb2730945c705eb859f6e185532cc6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T09:00'),
  'confirmed',
  '',
  '9948037',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('350cc6dd3bbab1b883e140529dd2a04c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Queen-nice Bila ', 'queenicebila@gmail.com', '0632233694', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0d8eef2fd4391920fa37dc65344951bf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '350cc6dd3bbab1b883e140529dd2a04c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T10:00'),
  'confirmed',
  '',
  '9937421',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '05947bab30f14c7381d8b9ff03dd0968',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '83cca02aa3e5a2f8cf0e9203b12ddd5d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T11:00'),
  'confirmed',
  '',
  '9937124',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ee0e9c104e34423ec56ff1d3ba173eb7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mmathapelo Kobuoe', 'kobuoemmathapelo@gmail.com', '0624038066', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ef73fc6206a8ddbf46efee68d714708e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ee0e9c104e34423ec56ff1d3ba173eb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T13:00'),
  'confirmed',
  '',
  '9935660',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b15a2f2729e1034e6fe720f20a0e6ac3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T14:00'),
  'confirmed',
  '',
  '9913719',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d31d539f46f8cc34d63379868a699ace', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bontle Matlhogela ', 'martha.matlhogela01@gmail.com', '0721734153 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4cd07190662728907b2bc684ab2abac8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd31d539f46f8cc34d63379868a699ace',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-26T15:00'),
  'confirmed',
  '',
  '9871122',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('efe7349337a43a5de9bb60b5f823eb26', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntokozo Zikalala', 'nzikalala11@gmail.com', '0662856006', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '62879b1b26d4f2821caaf9cc76104938',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'efe7349337a43a5de9bb60b5f823eb26',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-27T09:00'),
  'confirmed',
  '',
  '9947830',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b3f97a7c3ab85553f151db94f1acd1c6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gontse Mabaso', 'mabasogontse@gmail.com', '0742558293', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74208d0dcf17689efd65c405bbd5ce9b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b3f97a7c3ab85553f151db94f1acd1c6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-27T10:00'),
  'confirmed',
  '',
  '9929807',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '697cd0cf4a419872df0a01fb6ac2c688',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-27T11:00'),
  'confirmed',
  '',
  '9949493',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bd7f98d0a6294926481132fd6409a8ea', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pontsho ', 'pontsho.jessicap@gmail.com', '0682895623', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f176dfbc6f7df0b6000a9f0c6b673f6d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bd7f98d0a6294926481132fd6409a8ea',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-27T13:00'),
  'confirmed',
  '',
  '9953008',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0c3c68174861c32f65ab411daa4af9f8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a362f12fa23b0736685b061b6ff7208d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-27T14:00'),
  'confirmed',
  '',
  '9953189',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6dbcf81b283b433698027b5242714c2b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fd158adfa21ea6fa03e91cd3290d04d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-28T10:00'),
  'confirmed',
  '',
  '9934215',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '11f9d34bea2f60fee857c8f4bb3c1ea1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc4fa2b41719e9a5a1e10284ebf8fb41',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-28T11:00'),
  'confirmed',
  '',
  '9937484',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1daa0164e741beaec10379465c2318f3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tinyiko mdluli', 'mdlulitinyiko7@gmail.com', '0647026719', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7f7793d991648a20b9faaa9a2d064bf7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1daa0164e741beaec10379465c2318f3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-28T13:00'),
  'confirmed',
  '',
  '9943295',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f57645d181c19ba0b25bc61305176711',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9eeb953dfbd70e5ad541ba3ab752c960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-28T14:00'),
  'confirmed',
  '',
  '9951523',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('faf7aee6b2356edd9f81b29642c0053d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Anike Molefe', 'anikemolefe6@gmail.com', '0712368139', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dea8fa6d920a9fabba2dd76543c254e4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'faf7aee6b2356edd9f81b29642c0053d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-28T15:00'),
  'confirmed',
  '',
  '9937486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b62dd7ea96ea8af06c8de8804c1aa096',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9eeb953dfbd70e5ad541ba3ab752c960',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-29T09:00'),
  'confirmed',
  '',
  '9947044',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c003f7120180ec7b355fd8d539417410',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6dea2385565bfe132e00cf399c5d14ce',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-29T11:00'),
  'confirmed',
  '',
  '9918098',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '072f1ca62d2ea296a5309528a3156a0d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-29T12:00'),
  'confirmed',
  '',
  '9954224',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0663578e0e40cc1489bf0a85cfc60feb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1fbf021483d5fd29140660f57d0869c9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T09:00'),
  'confirmed',
  '',
  '9943991',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('24dff4a2f271f2e783cad6214f9b288c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Olivia moja', 'oliviatshwene52@gmail.com', '0832726508', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'aaebfac6f8a461490983e33bfa42df57',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24dff4a2f271f2e783cad6214f9b288c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T10:00'),
  'confirmed',
  '',
  '9946647',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('02bf0c2f4bbc165ff8879e74953f8ad5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thulisile ', 'thulisilemasombuka09@gmail.com ', '0678514283', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'acf9e8eeb34f0361abe76e7acaf2f80a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '02bf0c2f4bbc165ff8879e74953f8ad5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T11:00'),
  'confirmed',
  '',
  '9956196',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3e14fe7e9659945d21accb973c3db29b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Oratilwe Kamogelo', '', '0614144983', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f30811a71ce7ee38aac853629293eed8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3e14fe7e9659945d21accb973c3db29b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T13:00'),
  'confirmed',
  '',
  '9952812',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e160ce197abb55ce3a84bdb50b5088da',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T14:00'),
  'confirmed',
  '',
  '9956561',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bd585e832065ccf7e28971a51d475c9d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '02bf0c2f4bbc165ff8879e74953f8ad5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-06-30T15:00'),
  'confirmed',
  '',
  '9956213',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4b9811bb4514e665cde618a63583f433', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Palesa', '1022palesa@gmail.com', '0671541540', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f80bb648e159dd3bc49f49142527d1cc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4b9811bb4514e665cde618a63583f433',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-03T15:00'),
  'confirmed',
  '',
  '9967108',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ddd8ba19a0ef84075e51263c708741f5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T09:00'),
  'confirmed',
  '',
  '9969688',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '28e8bb3a51c5ab4a3236099144f5593c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T10:00'),
  'confirmed',
  '',
  '9970573',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('94d5897d71e986ffff0bd4053310d45f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Koketso', 'koketso.lucky@icloud.com', '0793050383', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7ba9b8118f3cb701a9080c0e048956c2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '94d5897d71e986ffff0bd4053310d45f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T11:00'),
  'confirmed',
  '',
  '9968587',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '999212b8f021a78e63ff5977d9f043aa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T13:00'),
  'confirmed',
  '',
  '9970437',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '97a698ea03e5df7798f1e2dffe73804d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T14:00'),
  'confirmed',
  '',
  '9969983',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6492a977ad6dc8e2546adb45a3bec9ac', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Happy Kgatle', 'kgatlehappy3@gmail.com', '0745458510', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5f07687e76a21419b4c6b9f8021aebf8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6492a977ad6dc8e2546adb45a3bec9ac',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-04T15:00'),
  'confirmed',
  '',
  '9962547',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('26b94086a762b07c16c23a0b044edf25', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vuyiswa Mahlangu ', 'vuyiswamtshali12@gmail.com ', '0799782187', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a55455430d726c8f1449b7b33ae29275',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '26b94086a762b07c16c23a0b044edf25',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-05T10:00'),
  'confirmed',
  '',
  '9971544',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a473e390649dc120772a32efec06e9b9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'THOKOZILE ', 'thokozilesekgobela8@gmail.com', '0763326724', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1f4b931836c083426bf53803acd94754',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a473e390649dc120772a32efec06e9b9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-05T11:00'),
  'confirmed',
  '',
  '9971582',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7191581f020e197b9c170245f495347b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ee0e9c104e34423ec56ff1d3ba173eb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-05T14:00'),
  'confirmed',
  '',
  '9969584',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c6ca71aa1ad6543030488961717c3afb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-05T15:00'),
  'confirmed',
  '',
  '9961417',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a044109d82c4e6032627adb2cf3a1210',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c14f1dcdb6671726f184fdaada3fda0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-07T09:00'),
  'confirmed',
  '',
  '9975075',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'de09c915aa2c42c5dcf4d79b8adf6544',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-07T13:00'),
  'confirmed',
  '',
  '9973380',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e38dc3164394227110f34d7a574985c5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '83cca02aa3e5a2f8cf0e9203b12ddd5d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-07T14:00'),
  'confirmed',
  '',
  '9976445',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '133764b5f3c0fa8b5eaa80c0fdefe8dc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-10T15:00'),
  'confirmed',
  '',
  '9984338',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '86ec6d2ecdabbf2e9211fcec8bb0c03c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '02bf0c2f4bbc165ff8879e74953f8ad5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T09:00'),
  'confirmed',
  '',
  '9977296',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4f027d0714d9ad35af1efeb2413bd39a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T10:00'),
  'confirmed',
  '',
  '9976731',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b48da1aca708277f19f8e17b92c7ad14',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T11:00'),
  'confirmed',
  '',
  '9976748',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7143be2823a9860af1bbb85950da8133', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Takalani', 'tharagatakalani@gmail.com', '0793432374', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '09b1632a845cf1a7968a86aacc779d7d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7143be2823a9860af1bbb85950da8133',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T13:00'),
  'confirmed',
  '',
  '9977996',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b88d64966f0aa4d24a0be08de6bd9a91', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vivian ', '', '072 937 0177 ', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '34f2edecbcacb86a71b520f14096f3dd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b88d64966f0aa4d24a0be08de6bd9a91',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T14:00'),
  'confirmed',
  '',
  '9971764',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5852d91925683f55dca7e6a16a5c8ee0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-11T15:00'),
  'confirmed',
  '',
  '9978972',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'edbc95ebcfddb8498d5c13017346917e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f3f72597a305d2841243231ab181c675',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-12T10:00'),
  'confirmed',
  '',
  '9972974',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f886ae26cd26d4283e6c336259402da8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zandile Dlamini', 'zandiledlamini991112@gmail.com', '0616937430', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd81d10cf8848b25f970f6342ace7d40a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f886ae26cd26d4283e6c336259402da8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-12T11:00'),
  'confirmed',
  '',
  '9976654',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0308e12bdf657dbb31ad15d3ab157058',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a04cd8d8eef7a110d0f374050642c92',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-12T13:00'),
  'confirmed',
  '',
  '9978701',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e69d43e52320d77ee7ed244269ca3849',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3e14fe7e9659945d21accb973c3db29b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-12T14:00'),
  'confirmed',
  '',
  '9987418',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '93399c29103e9941c188785cd646545a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-12T15:00'),
  'confirmed',
  '',
  '9987566',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a1d5fc557aeba2b472a60948cb065193',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-13T09:00'),
  'confirmed',
  '',
  '9992827',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('08e4bf45f99fa4a11d91b7e24c38c957', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Winnie', 'phosawinny@gmail.com', '0679081233', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '352fce3f38cbc6d5f3725e703b96d47d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '08e4bf45f99fa4a11d91b7e24c38c957',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-13T11:00'),
  'confirmed',
  '',
  '9993000',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('363c3e8e52739b62f40aa9d486770ba0', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Msizi Makaula', 'msizimakaula17@icloud.com', '0765100024', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c6d56ddd673f2a3c977c5f7af291af69',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '363c3e8e52739b62f40aa9d486770ba0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-13T12:00'),
  'confirmed',
  '',
  '9977158',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e935a967e85e33249aca809a9c53bb5e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele', 'zanelelanga@gmail.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '543b3def758950cbe32b4100852c2818',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e935a967e85e33249aca809a9c53bb5e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-14T09:00'),
  'confirmed',
  '',
  '9994112',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('aa3aca88ca71ab09e512a4171c26038e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kelebogile Seane', 'seanekelebogile20@gmail.com', '0679184606', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '39bc346d8142887505eb36331964437e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aa3aca88ca71ab09e512a4171c26038e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-14T11:00'),
  'confirmed',
  '',
  '9993008',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7af3725101566b540e479e2948db7ec5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '62ee698d1b3fccb9823188847e571a4e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-14T13:00'),
  'confirmed',
  '',
  '9995149',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5d4c84e40f3af1e672b15299cb2cb730',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1fbf021483d5fd29140660f57d0869c9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-17T09:00'),
  'confirmed',
  '',
  '9985440',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2c33c647da267bdac2447c6285c08fc7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4b9811bb4514e665cde618a63583f433',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-17T10:00'),
  'confirmed',
  '',
  '9999551',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e04c6c17a004192a94351c69752ac484',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ee0e9c104e34423ec56ff1d3ba173eb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-18T09:00'),
  'confirmed',
  '',
  '10003972',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('63fbc11f8e7813b9f64ff5852297061e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshegofatso Hutang ', 'tshegohutang@hotmail.com', '0735264207', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9ceff349724e125500b516a180e121d2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '63fbc11f8e7813b9f64ff5852297061e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-18T10:00'),
  'confirmed',
  '',
  '10007425',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9ef26b2d0403d559bcf9b41c95094a05',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-18T11:00'),
  'confirmed',
  '',
  '10006006',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bbb57d57ef5eadad016664d71f746b3e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '38a31aa813f3da1dec9b4900967c062e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-18T13:00'),
  'confirmed',
  '',
  '10006540',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e221da7bb2f5bd335dec338af23b0831',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7cdfa4ecd2f9bd14cba6e27abf54f740',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-18T15:00'),
  'confirmed',
  '',
  '9997224',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b9b589ef13f1f72de41e4ac09309b4fe', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tsholofelo ', 'akamia799@gmail.com', '0738041020', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5b341f03d1ea2802b7f3afa4d4398a47',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b9b589ef13f1f72de41e4ac09309b4fe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-19T10:00'),
  'confirmed',
  '',
  '9984550',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b8c89a96356fa35e5f6a409b835b5f8f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'molebogeng', 'molebogengmatolong@gmail.com', '0715961496', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a476ab7764ada65a4ba5cc9b4f332a39',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b8c89a96356fa35e5f6a409b835b5f8f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-19T11:00'),
  'confirmed',
  '',
  '10008610',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e289ad6bc7559ca47951a34f6c2fcd77', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele', 'zanelelanga@gmail.com ', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e54d88dc71433aff5050420f44afd84c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e289ad6bc7559ca47951a34f6c2fcd77',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-19T13:00'),
  'confirmed',
  '',
  '10010610',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('51b1108f4209f696d55d9adfb1cfb5b8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo ', 'karaboragedi0@gmail.com', '0798349354', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '582847c45ab36ee1bef306453fee71ed',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '51b1108f4209f696d55d9adfb1cfb5b8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-19T14:00'),
  'confirmed',
  '',
  '9997447',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('27766acdaf108bbeac22ea5b382fa640', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nkululeko Sithole', 'nkululekosithole808@gmail.com', '0769980855', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f8fa7a8d210af8e4e9d85ca9e8f9a194',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '27766acdaf108bbeac22ea5b382fa640',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-19T15:00'),
  'confirmed',
  '',
  '9998357',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('913631d4a51be5d38e2bb66dd380268f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reagoboka Moila', 'reagobokamichell@gmail.com', '0659004952', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '638fe26274339fe0302d99ecb803dfb2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '913631d4a51be5d38e2bb66dd380268f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-20T09:00'),
  'confirmed',
  '',
  '10011409',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c731fbf38c84376d98c563271bce72bb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-20T11:00'),
  'confirmed',
  '',
  '9997921',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ac3e414476261eed2ff61f530e5413eb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'faf7aee6b2356edd9f81b29642c0053d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-20T12:00'),
  'confirmed',
  '',
  '9984832',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0205dedcc28ae14bab4b2b44c81be594', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Phillipine Masela', 'phillipine4@gmail.com', '0722842199', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd477f75b88d1f230a8602d815c2a2639',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0205dedcc28ae14bab4b2b44c81be594',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-21T09:00'),
  'confirmed',
  '',
  '10001960',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2ad125a84ce2d0558da8a3c372c97474', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nozipho ', 'zaneleplanga@gmail.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '69c20e0dbfec4cee2e232886778b0ec8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2ad125a84ce2d0558da8a3c372c97474',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-21T10:00'),
  'confirmed',
  '',
  '10010602',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3f843f9e54c990f4185fd0549b19f97d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e289ad6bc7559ca47951a34f6c2fcd77',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-21T13:00'),
  'confirmed',
  '',
  '10012319',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('04b8c35ce695db44e6b951705f6b5f8b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bontle Kekana', 'kekanab082@gmail.com', '0716776751', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '44b503299d478032d4bbaa81a5623cc6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '04b8c35ce695db44e6b951705f6b5f8b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-21T14:00'),
  'confirmed',
  '',
  '10009728',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '042c24a5a075bdea487524a399c6330a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e935a967e85e33249aca809a9c53bb5e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-21T15:00'),
  'confirmed',
  '',
  '10012325',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('4388036bd50cace2b28a2776382e0703', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vanessa Ramogale', 'vanessaholerato1@icloud.com', '0760281561', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cfebe171b249099dff876eef7bcdf1dc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4388036bd50cace2b28a2776382e0703',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-24T09:00'),
  'confirmed',
  '',
  '10013700',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3d9e9bc3405bae7a7a71afba187cbda3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '615c548ddcc53c8f3ff14cbe5ec4d601',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-24T10:00'),
  'confirmed',
  '',
  '10021543',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b67acadc52f04eb2ebd9e047555b34ce',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-24T10:00'),
  'confirmed',
  '',
  '10021636',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '42e956250b862e7388262ced1350677c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-24T15:00'),
  'confirmed',
  '',
  '10024103',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ab1319f7f523965a0e7c0bd0a700ec0d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bfc1903c56c8d2da95ca07654c8e01a3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T09:00'),
  'confirmed',
  '',
  '10024277',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7a8c3f6f9e751ba6aecb6c89e98de404', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Jubilee April', 'jubileeb23@gmail.com', '0649047200', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '176d1c8870206edc6fed7ae865c0b7e0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7a8c3f6f9e751ba6aecb6c89e98de404',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T10:00'),
  'confirmed',
  '',
  '10024243',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d34182e51f4c5edc0984c96bb598bba9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nteseng molotsi', 'ntesengmolotsi80@gmail.com', '0680529846', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '974ab253f441888b8a65f6e9abb6f5fb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd34182e51f4c5edc0984c96bb598bba9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T11:00'),
  'confirmed',
  '',
  '10023902',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f3441b22cf08ac9e2842c4f33e206366', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Blackdoll', 'prudencemacheke1@gmail.com', '0677209921', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c648f5e258593e8b71917a1d2d1aa11f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f3441b22cf08ac9e2842c4f33e206366',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T13:00'),
  'confirmed',
  '',
  '10011621',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9ec94421c6ad0ff9751e838b9bd38d85',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2bb782ca06120817676480dc85f21055',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T14:00'),
  'confirmed',
  '',
  '10025121',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b2081cc008b587ce4f5c7004ffa5dafc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-25T15:00'),
  'confirmed',
  '',
  '9961577',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ab50040e04c8c646dd54fedaa5c24bda', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gomolemo ', 'sekgotagp@icloud.com', '0825328495', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dbdeff0494eb24f543f23a40fa083546',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ab50040e04c8c646dd54fedaa5c24bda',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-26T10:00'),
  'confirmed',
  '',
  '10025061',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e541738ae99e708fa39be78a163cdb05', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ursula', 'ursularolani@icloud.com', '0719357108', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '05fecadda010d5ff351be5bc374346cd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e541738ae99e708fa39be78a163cdb05',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-26T11:00'),
  'confirmed',
  '',
  '10011026',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('37c19b7583c0c9843f0bfe800f6b7f64', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'khensani Nkanyane ', '', '0790543631', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8bd0acd2bc75478e8a50ea49857765f9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '37c19b7583c0c9843f0bfe800f6b7f64',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-26T13:00'),
  'confirmed',
  '',
  '10013862',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '56f462a4d52a618cd35f00b5f20d1dfd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e935a967e85e33249aca809a9c53bb5e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-26T14:00'),
  'confirmed',
  '',
  '10023679',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '30403b3b9bcb4bda107f5f69aef9d99a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86b15ad9b0b238662792fafbd8228498',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-26T15:00'),
  'confirmed',
  '',
  '10023482',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5a98ba7de275388f80641727d7d3a8e6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maitemogelo Ngale', 'maite.ngale@gmail.com', '0610837268', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ad6c36e1b04f91389839deec91398877',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a98ba7de275388f80641727d7d3a8e6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-27T09:00'),
  'confirmed',
  '',
  '9989236',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fc67b3ae0fa8e27be1a5fc174fde7d57',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a04cd8d8eef7a110d0f374050642c92',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-27T11:00'),
  'confirmed',
  '',
  '9985843',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6a458eae3682f6981c7a82c45c070136',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6471233a1e976be1ec4e162e0791b0f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-27T12:00'),
  'confirmed',
  '',
  '10003977',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d2f1c5042511b8cc38435e417faef3b1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele', 'zanelelanga@46gmail.com', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7aa317e9c36ef34071453694b6d591d0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-28T09:00'),
  'confirmed',
  '',
  '10030288',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c1125fa432bacb9d3fac6036b5d85526', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele', 'zanelelanga@46wil.com ', '06473961', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e0f28079479975b53de5579250f0c63c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c1125fa432bacb9d3fac6036b5d85526',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-28T10:00'),
  'confirmed',
  '',
  '10030292',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('274b4e73dc2e86030c68fd30fade54e3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lesego Buys', 'lesegobuys10@gmail.com', '0734830294', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c109f3a71e43c7ee8cf0af7f8e701b26',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '274b4e73dc2e86030c68fd30fade54e3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-28T13:00'),
  'confirmed',
  '',
  '10031711',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('101515ba4966dcdfd9b1418e33943b39', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato gogo Mpisi ', 'leratompisis@gmail.com ', '0694132733', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e968f1d4143c20f2c242c02fa326fba9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '101515ba4966dcdfd9b1418e33943b39',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-31T09:00'),
  'confirmed',
  '',
  '10033719',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a6db3c1681bc7e41e8e956766dde184f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'B Mahlangu', 'sibongilemahlangu080@gmail.com', '0764675907', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '11699c880337af8c6b688f0d842a9619',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a6db3c1681bc7e41e8e956766dde184f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-31T13:00'),
  'confirmed',
  '',
  '10034731',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '40f8d915fb53a215266cc055810f76ad',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4b9811bb4514e665cde618a63583f433',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-07-31T15:00'),
  'confirmed',
  '',
  '10041817',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3e47c2ea1757831a5b8b369b3824e1d1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '34311d4775411666ed62b28d9d55c00c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T09:00'),
  'confirmed',
  '',
  '10037482',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9414a966bc92af439ac41b9b6be8d5fb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd34182e51f4c5edc0984c96bb598bba9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T10:00'),
  'confirmed',
  '',
  '10041882',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '49911eafe684e5a649dd6604cc84753e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '83cca02aa3e5a2f8cf0e9203b12ddd5d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T11:00'),
  'confirmed',
  '',
  '10043448',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('09367ec60f000c7ef7af37ce8c548acc', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Oratile Rathanya ', 'oratile.rathanya@gmail.com', '0732562036', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4a33fd3858ae7794dfc2751c8f762363',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09367ec60f000c7ef7af37ce8c548acc',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T13:00'),
  'confirmed',
  '',
  '10042713',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '077012e8958ac63cf1cf78a50cc66c4f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T14:00'),
  'confirmed',
  '',
  '10042574',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4f8485311aa0e686b97823caaab22a9c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-01T15:00'),
  'confirmed',
  '',
  '10041966',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3f4ae4e6ab44ca021c4a15fbb357afc1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bianca', 'tebogokarabomatlou@gmail.com', '0836122466', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '57fdb76fc71d4f6e6f5a18d0eb54b6ea',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3f4ae4e6ab44ca021c4a15fbb357afc1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-02T10:00'),
  'confirmed',
  '',
  '10011348',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c17ffdb986af1ab9a994a8cb50ac81be',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '608904cf19288a95ead07c6f2c8b8a8d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-02T11:00'),
  'confirmed',
  '',
  '10011696',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8fb3d179a246b77d3f8ac0d4342d6688', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng ', 'nthabimokhutswane@gmail.com ', '0796270563', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f986df1c95ab48753dc996cd3831ab4f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8fb3d179a246b77d3f8ac0d4342d6688',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-02T13:00'),
  'confirmed',
  '',
  '10041660',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a958d1654476b44882081bb626fb7f13',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-02T14:00'),
  'confirmed',
  '',
  '10043533',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0bf74e183220c62a5eb7e368a32fda01',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-02T15:00'),
  'confirmed',
  '',
  '10043563',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f4b725b4e5494141f42a94b8bf011382', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Samantha ', 'samantha.makgabo@gmail.com', '0729852124', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7a4f23906e19e44ca3112d8555f34be4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f4b725b4e5494141f42a94b8bf011382',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-07T13:00'),
  'confirmed',
  '',
  '10054220',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2b1fff2c42274087b007c4649ba71990', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Hope Sibanyoni ', 'hopesibanyoni12@icloud.com', '0695425379', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2822c87f88a17e02461817edc2ecef8a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2b1fff2c42274087b007c4649ba71990',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-07T14:00'),
  'confirmed',
  '',
  '10057043',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4413db3012af7cc104236c69faeb773b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0205dedcc28ae14bab4b2b44c81be594',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-07T15:00'),
  'confirmed',
  '',
  '10054292',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ee2bc644cadbb48c3f84416c86b3925f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4b6b85ccdaae4d6f01f6d552c75ca118',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T09:00'),
  'confirmed',
  '',
  '10058977',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b918a4f96ea6ce16ec1b9fddc5409d18',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6471233a1e976be1ec4e162e0791b0f2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T10:00'),
  'confirmed',
  '',
  '10059906',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('67b6341982d8a02810697ceba0c5b0b1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rejoyce ', 'rejoycehlongwabe@gmail.com', '0795656023', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '673b5142ab79256dab750f2bc35a3bf7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '67b6341982d8a02810697ceba0c5b0b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T11:00'),
  'confirmed',
  '',
  '10052161',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('bb1d0cc203c938c98434e663f69c2faa', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rethabile Thole ', 'tholerethabile@gmail.com', '0810690899', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '11ae96fe22acd4565444b285a1e40e5c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bb1d0cc203c938c98434e663f69c2faa',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T13:00'),
  'confirmed',
  '',
  '10055095',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d3b3130bf945d4ca03b681e64945f1b1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Matildah ', 'khensanichauke270@gmail.com', '0670236027', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '28851756c58f6b33904771b2b126eba0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd3b3130bf945d4ca03b681e64945f1b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T14:00'),
  'confirmed',
  '',
  '10042912',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'aa8eb9a95772f39fb36e509ba7ed44d4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'faf7aee6b2356edd9f81b29642c0053d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-08T15:00'),
  'confirmed',
  '',
  '10041871',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6f71d987a22e4bf90725f911ebd0ba16',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-09T10:00'),
  'confirmed',
  '',
  '10053333',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1ff911ff534cfe7ad78e512163f8fca8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-09T11:00'),
  'confirmed',
  '',
  '10053804',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '452a5190a50e076682235945610ac1b6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-09T13:00'),
  'confirmed',
  '',
  '10058146',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4985dcc6a015b089ee3e165e2e02544d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-09T14:00'),
  'confirmed',
  '',
  '10063676',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('328c8ad00d9db38e458c700b874d6264', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato Kekana ', 'llerato724@gmail.com', '0720785773', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '79f9376496db6168b5b71148a4c6e18d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '328c8ad00d9db38e458c700b874d6264',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-10T09:00'),
  'confirmed',
  '',
  '10062953',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '100481646bd196811eadf63c7be3f45d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-10T11:00'),
  'confirmed',
  '',
  '10062789',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('848973b6f9d5dcfd21a7fd1211597a16', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mabasa Xongela', 'mabasaxongela@gmail.com', '0680435817,0745328126', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '52d4059c24bb75d3c59bc72740fea783',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '848973b6f9d5dcfd21a7fd1211597a16',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-10T12:00'),
  'confirmed',
  '',
  '10062473',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ac136bec3fbefb4cfa5817cced386f8b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09f0c15fac936a9097a822b3aa5ff74b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-11T09:00'),
  'confirmed',
  '',
  '10066455',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2d95823f3f6f7859d7f411bba5a3fbfa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '101515ba4966dcdfd9b1418e33943b39',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-11T10:00'),
  'confirmed',
  '',
  '10065848',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2803ce75db60a1b78baec14974c06db4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-11T15:00'),
  'confirmed',
  '',
  '10065902',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2e644dab55f1d61c4bfe8fcc76cf2e19',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T09:00'),
  'confirmed',
  '',
  '10065898',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2f454488e13e014f065adfc30e503679',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T10:00'),
  'confirmed',
  '',
  '10077579',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '672e5b0824e9c770b452d8e3d446defa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cc4495f6d53f8ea57948035d44adf869',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T11:00'),
  'confirmed',
  '',
  '10075753',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8270ddc115e960c34aa4b986a08951d8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maditlhare Moleme ', 'moleme0406@gmail.com', '0714130452', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cb599ac789250010d8c4528fb6621096',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8270ddc115e960c34aa4b986a08951d8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T13:00'),
  'confirmed',
  '',
  '10078196',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('636fe04a8170cea3266995c3c2e9c43b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntsako Baloyi', 'ntsakolee88@icloud.com', '0849778248', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a8c40452015621b65c4bb7120b23e503',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '636fe04a8170cea3266995c3c2e9c43b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T14:00'),
  'confirmed',
  '',
  '10076556',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b1fea4dc635bcb09eb087f64ece02b54', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'lethabo Bridget', 'lb.motau@gmail.co ', '0722739247', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f31ac334272be8a425587908d318e99c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1fea4dc635bcb09eb087f64ece02b54',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-14T15:00'),
  'confirmed',
  '',
  '10077644',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8451ee160852a42e84d8968d0a44b9bd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eecba32ccb06b556a200dce1df5223b4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T09:00'),
  'confirmed',
  '',
  '10079284',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dd5e69c1685db9d75628f202ba5981d8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd34182e51f4c5edc0984c96bb598bba9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T10:00'),
  'confirmed',
  '',
  '10077722',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '82de45be1c8e7098dee6c774d9b48812',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '94d5897d71e986ffff0bd4053310d45f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T11:00'),
  'confirmed',
  '',
  '10078547',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '696b932312bc83c496a3ca52536eebf8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T13:00'),
  'confirmed',
  '',
  '10071193',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '77341d65e870f662cf6e799b92036f0a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35ef40d3db40e5f969bbfe400b8c0579',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T14:00'),
  'confirmed',
  '',
  '10068895',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '596bd2f50986eafa7d347968558330ec',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-15T15:00'),
  'confirmed',
  '',
  '10080303',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fbc289a353ff8206eef5e43cdfce1345', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dineo ', 'onlydineo04@gmail.com', '0761975365', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bdaef0a06efc3ee2b70455bc53b2cfe2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fbc289a353ff8206eef5e43cdfce1345',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-16T10:00'),
  'confirmed',
  '',
  '10066960',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0ebc9f33499dabed41c20f15ce274ab4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24db0df0f3f2782fc9effd3f6d50e74a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-16T11:00'),
  'confirmed',
  '',
  '10079373',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '03d841d98ab010c73bc908fd4f0fda24',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-16T13:00'),
  'confirmed',
  '',
  '10081145',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '26983e1917960f477c8e396454282c57',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42ef951297947e40464e7e6b5b1a6509',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-16T14:00'),
  'confirmed',
  '',
  '10080968',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('999091a0293be93cd393c6fae8f5e689', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Maria Mudau', 'dankieria18@gmail.com', '0790315813', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0c257a1dbb50f5273f3c7f24f6e6683d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '999091a0293be93cd393c6fae8f5e689',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-16T15:00'),
  'confirmed',
  '',
  '10075227',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7618b20470535c854e7acf303d7a3316', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Oagengowankiie@gmail.com', 'oagengowankiie@gmail.com', '0766018502', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'df2e0b9253e7df490e04fb71799da7b7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7618b20470535c854e7acf303d7a3316',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-17T09:00'),
  'confirmed',
  '',
  '10082920',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '50c173d3ab4acfe988845bb8958a5715',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-17T11:00'),
  'confirmed',
  '',
  '10083070',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9ba64db89b839e62f03925a5618320c9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dimakatso ', 'dimakatsomangwane8@gmail.com', '0695400654', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e82a6039a6b3f3767e22560072130842',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9ba64db89b839e62f03925a5618320c9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-17T12:00'),
  'confirmed',
  '',
  '10082347',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2761ace146376678c74951a70d6a7ba4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4878eadb9bc71d7f0778db1635926307',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-18T09:00'),
  'confirmed',
  '',
  '10083233',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7c90947b99ee0e5905957b3e3cc0e253',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2bb782ca06120817676480dc85f21055',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-22T10:00'),
  'confirmed',
  '',
  '10094008',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e6886bd16eec987542bccac005b40ee0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd34182e51f4c5edc0984c96bb598bba9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-22T11:00'),
  'confirmed',
  '',
  '10096511',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('68edc4140b75e3861ac49c503ca75600', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Busisiwe Zwane', 'busisiwem.bz@gmail.com', '0725339473', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6bcef35b2a8dbeb386b4f7daf1b611aa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '68edc4140b75e3861ac49c503ca75600',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-22T13:00'),
  'confirmed',
  '',
  '10091891',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ed27530d723c0d56886bcc11ee51cc7f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a5f5c6292570e1727c0731533ef1f593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-22T14:00'),
  'confirmed',
  '',
  '10095229',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2ec4781ae2a28f6070e3263e2713189c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '04f0c72b1f40f623115aa770de447e1f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-22T15:00'),
  'confirmed',
  '',
  '10082770',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('756f9e2b037f3c3ff01763be6fc89c48', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Karabo', '', '0636598615', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74e1c95d275fd9b80adfe8e375079310',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '756f9e2b037f3c3ff01763be6fc89c48',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-23T10:00'),
  'confirmed',
  '',
  '10078014',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dedde5454efd50a2374dc951c9a5779c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '575180003ee6f767e5c91288b1825e7e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-23T15:00'),
  'confirmed',
  '',
  '10100605',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '469a2331a532b56975b273d15d6a0ff0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-24T09:00'),
  'confirmed',
  '',
  '10101022',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd589f3f5eea84a1143d931aaa81a8973',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a700270e6f648f0bee246b600c95de5a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-24T11:00'),
  'confirmed',
  '',
  '10101153',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74e6b0c25ee491b3d035075d77b09b27',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-24T12:00'),
  'confirmed',
  '',
  '10092265',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e73ed6424fc86aeb37efcd6a48b61a87',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '274b4e73dc2e86030c68fd30fade54e3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-25T09:00'),
  'confirmed',
  '',
  '10102002',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b3e21f2e5e29d060064468ff0401a756', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nyeleti selma', 'nyeletiselma@gmail.com', '0722697158', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9860a7f92e203faeb74d85ab3672b025',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b3e21f2e5e29d060064468ff0401a756',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T09:00'),
  'confirmed',
  '',
  '10110871',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0b75b9bf6fc33e2df15d68f01f3c89ab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aca262867f63a60b66173c6820f0cef4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T10:00'),
  'confirmed',
  '',
  '10107930',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('24f6b7d61acedbbac208229fd13d590c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keitumetse ', 'keitumetsevmmako@gmail.com ', '0609083596', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '55c06b0a96cd52f22abb191022708c12',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24f6b7d61acedbbac208229fd13d590c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T11:00'),
  'confirmed',
  '',
  '10109285',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('22e1da1a9b4d56ef347235a1f9eb7ac9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gontse', 'luckygontse8@gmail.com ', '0720789294', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0e031dbe76e47452e58585561abaed74',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '22e1da1a9b4d56ef347235a1f9eb7ac9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T13:00'),
  'confirmed',
  '',
  '10103515',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cca31a84185dbf980581ac0e9b8fcaba', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshegofatso mokatse', 'tshegofatsomokatse48@gmail.com', '0649383642', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74dc70342105b7af4445c5797b64eb37',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cca31a84185dbf980581ac0e9b8fcaba',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T14:00'),
  'confirmed',
  '',
  '10110870',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('666cfee099f55b55927c7c61dcc753e6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Doreen', 'doreenmakgoka@gmail.com', '0792177010', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ebc01ba8dcfa193655bd69c248d2adfe',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '666cfee099f55b55927c7c61dcc753e6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-28T15:00'),
  'confirmed',
  '',
  '10103494',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3fc66d6208e8fbfbb2c75a319d47349f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mmetsa Kekana ', 'mmetsabkekana@gmail.com', '0838945555', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9c25de12de8ec8712ff61172403a4ba7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3fc66d6208e8fbfbb2c75a319d47349f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T09:00'),
  'confirmed',
  '',
  '10076075',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd8f99e8dab0af5c49fa52021d82cec2f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T10:00'),
  'confirmed',
  '',
  '10082985',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ea667e67006ada2dd5cd3739b25f40d8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7b71be69f5bc3a5ab8025ff9007bf1a1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T11:00'),
  'confirmed',
  '',
  '10084849',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('eb6196c243e8f7334a452e8ebcf123cc', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandeka', 'thandekamthimunye161@gmail.com', '0715750912', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '13eec97dded7026d46efec95e3fbe550',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eb6196c243e8f7334a452e8ebcf123cc',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T13:00'),
  'confirmed',
  '',
  '10104211',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a8480ad450d4bcdf261a3894fed98e99', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tumiso Machweu ', 'machweut@gmail.com', '0826815359', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8125a905efc7fd91d0e10943180cc060',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8480ad450d4bcdf261a3894fed98e99',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T14:00'),
  'confirmed',
  '',
  '10105489',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5018b317de53fc3cba1c3cbe0abb28b9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-29T15:00'),
  'confirmed',
  '',
  '10106827',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7f75c968901c3ce9461c4bbbd0616ea6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-30T10:00'),
  'confirmed',
  '',
  '10107628',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('343dd0c9320aec338038535e33b9209a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kitso', 'kitso.1@icloud.com', '0726840136', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '84b7f0bf6438c8264f20086f0670e9a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '343dd0c9320aec338038535e33b9209a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-30T11:00'),
  'confirmed',
  '',
  '10062736',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '662ae6a32403e0b5c2ee2f5c2dd89c7a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-30T13:00'),
  'confirmed',
  '',
  '10113099',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '105a4c48705e56f8b8e39f5c9644628c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-30T14:00'),
  'confirmed',
  '',
  '10117597',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c229e8e1f44de6d48bbe1b83d3a39aab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a00fbca0f0775b55dfd9a9a8f83630ad',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-08-30T15:00'),
  'confirmed',
  '',
  '10103755',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '29e0e5a39a10fc5ee68d1f94fd57066e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-01T09:00'),
  'confirmed',
  '',
  '10122075',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('97f73d7a8e91f4182297270fe1eb8923', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tiego Lebogo', 'tiego.lebogo@icloud.com', '0745237897', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ef46298701fd9fd5d9c6950615614951',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '97f73d7a8e91f4182297270fe1eb8923',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-01T15:00'),
  'confirmed',
  '',
  '10119466',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '506b1f41745652b69fdd88deb0c128a3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc4fa2b41719e9a5a1e10284ebf8fb41',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-04T09:00'),
  'confirmed',
  '',
  '10112850',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fb6ec5542ad0e96086a50533ef016bc6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-04T10:00'),
  'confirmed',
  '',
  '10132106',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8210f56ef2e33c2619b30326bb699a5c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mpho sebelebele ', 'mphosebelebele349@gmail.com', '0658116380', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e4f9bacb1aa72d9aafc306e43e320de3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8210f56ef2e33c2619b30326bb699a5c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-04T11:00'),
  'confirmed',
  '',
  '10132295',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7fde1ccd3067ff68e12a13f4170972e7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'S’lindokuhle Ntimbane', 'slindourhgwalarh@gmail.com', '0725328116', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0e4de692bb7e9f6e092b4b2013c5433e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7fde1ccd3067ff68e12a13f4170972e7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-04T14:00'),
  'confirmed',
  '',
  '10133080',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('86d89aa364460ce451327a506293fb07', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Randy', 'randycles@gmail.com', '0796096358', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6e541073d7adb2c3be1b74b242f48838',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86d89aa364460ce451327a506293fb07',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-04T15:00'),
  'confirmed',
  '',
  '10132162',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8f8e288dbfabefc12230891ebc158834',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T09:00'),
  'confirmed',
  '',
  '10062582',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '10be820b99ca94e5f8731a2c87cb764b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5cac9138155bd3f67afa02e72434fa3a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T10:00'),
  'confirmed',
  '',
  '10133801',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '18706d1e106b9c5d4af96658bab62b9b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc4fa2b41719e9a5a1e10284ebf8fb41',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T11:00'),
  'confirmed',
  '',
  '10112872',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a25e7305bf727c3f5ff72431169d48ff',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '756f9e2b037f3c3ff01763be6fc89c48',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T13:00'),
  'confirmed',
  '',
  '10102017',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7179b166bb7adb2f73e9125df69a8440', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Prudence ', '', '0767290230', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c1b398c31cd85f074e2f9ad887a4ad16',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7179b166bb7adb2f73e9125df69a8440',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T14:00'),
  'confirmed',
  '',
  '10093598',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4500ad92be38e3c169291a11d469f777',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '67886ba683a8d61d7c0f5e82b06dd245',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-05T15:00'),
  'confirmed',
  '',
  '10081693',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '682aaee2325d1a973d39ac8dc1379fb8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86ad23ea0f7e984564832e2720551593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-06T10:00'),
  'confirmed',
  '',
  '10006644',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '892ca7ef886eb1d7fc9a8dce9e1c0070',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-06T11:00'),
  'confirmed',
  '',
  '10126615',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('87a2402ff8f3d559c54218bb86220752', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng', '', '0615159341', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '51ad8a21fdcc818d33eb35bf9dc24ca8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '87a2402ff8f3d559c54218bb86220752',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-06T13:00'),
  'confirmed',
  '',
  '10125352',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e472442a3b755294abd039b4704b0008', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mylady', 'myladymathe@gmail.com', '0762744680', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6383ba48270fef067bb1c0a0b0ab9af1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e472442a3b755294abd039b4704b0008',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-06T14:00'),
  'confirmed',
  '',
  '10136818',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '79bb73fe1b5b31f5dc6e1654e6b18184',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '636fe04a8170cea3266995c3c2e9c43b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-06T15:00'),
  'confirmed',
  '',
  '10122348',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d0abed6a9806dab49185aa02b6923b66', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Vuyisile', 'vuyisile.queen@gmail.com', '0760421513', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '20a745df37534606ed39a1ab1c970ad3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd0abed6a9806dab49185aa02b6923b66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-07T09:00'),
  'confirmed',
  '',
  '10124678',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('24801ce1d66d3b853f95d318b3bf04ef', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thereza Marema ', 'thereza.marema@icloud.com', '0685848406', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '49db91994a14246c159a40f576913ae8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24801ce1d66d3b853f95d318b3bf04ef',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-07T11:00'),
  'confirmed',
  '',
  '10082783',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd6d7d80e039182f0cc90de6f1b35e35f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-07T12:00'),
  'confirmed',
  '',
  '10125708',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d02c2e1bc102ce5c99ed790262c6e1af', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lilly', 'ntesengmolotsi80@gmwil.com', '0680529846', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '72924cf10e5acfa375592d5ed0b1b475',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd02c2e1bc102ce5c99ed790262c6e1af',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-08T09:00'),
  'confirmed',
  '',
  '10143734',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd67b47c6fd1dd67e24cc3b29a00ee54f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5c3cd4504e350cf6acd4be25a41eecc6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-08T15:00'),
  'confirmed',
  '',
  '10145656',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('85bb3d8b111a4c1689f6194a3fb721f7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ivy Mujovo ', 'mujovoivy@gmail.com', '0663294245', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ff4fe7ea5ae002c380b3727fccb95851',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '85bb3d8b111a4c1689f6194a3fb721f7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-11T09:00'),
  'confirmed',
  '',
  '10112864',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8448e0651cb4c4d66811447eda46c90d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tsholo ', 'omphemetse.seloane@icloud.com', '0605206393', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9d83053ac7ac36b766327a1aad1aeb2b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8448e0651cb4c4d66811447eda46c90d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-11T10:00'),
  'confirmed',
  '',
  '10117803',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8b0469ee6594dbbbab45d19dc276c280', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gavaza Baloyi', 'baloyigavaza9@gmail.com', '0727746987', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b13d44cd76fc73ef85bde3ebf871b3a7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8b0469ee6594dbbbab45d19dc276c280',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-11T14:00'),
  'confirmed',
  '',
  '10144530',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '64ed486e7a919abd984b7c70b7b65953',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-11T15:00'),
  'confirmed',
  '',
  '10143021',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('94c890893216d324f8f3ca6362c9ae5b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reagile ', 'ragipetja@gmail.com', '0658724816', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '46f85bbb5cc6fa370156379b56990377',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '94c890893216d324f8f3ca6362c9ae5b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T09:00'),
  'confirmed',
  '',
  '10158273',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c33da2573a7fdf585d9035c0ceb766e9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0e3218a532750e2cd85747b3ba82f34b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T10:00'),
  'confirmed',
  '',
  '10141971',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e26a8965e7f0231134f88ea8f3d4e2da',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aca262867f63a60b66173c6820f0cef4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T11:00'),
  'confirmed',
  '',
  '10157568',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a7f9cacd77c3fc7bc68c026320b879aa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24f6b7d61acedbbac208229fd13d590c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T13:00'),
  'confirmed',
  '',
  '10152640',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '51c07103c6dc239eec44652f3717cc1b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f4b725b4e5494141f42a94b8bf011382',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T14:00'),
  'confirmed',
  '',
  '10131241',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ead6eff7fe4cc1cc6df10daaebb4b6ef',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c4336e3cebd5c2ee0de1b36f2d657d4e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-12T15:00'),
  'confirmed',
  '',
  '10156320',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8e123435c7f3d5a3ee256c93e4f4e59f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pertunia', 'nkhentsiem@icloud.com', '0795563094', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3a4b95b83bfeb70b36ec3749a9883185',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8e123435c7f3d5a3ee256c93e4f4e59f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-13T10:00'),
  'confirmed',
  '',
  '10154607',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a400b3ab21c6d007d0edaf4e4e746399', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Naledi kgopa', 'kgopanaledi26@gmail.com', '0676085283', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c8c0ea73370aa006b14009a078ad3d52',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a400b3ab21c6d007d0edaf4e4e746399',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-13T11:00'),
  'confirmed',
  '',
  '10154685',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7504b59779587559cb7da565cb2e9436', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lesego', 'lesegomatlala1998@gmail.com', '0664649990', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4effc274ee19764960af0e73f8aa753e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7504b59779587559cb7da565cb2e9436',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-13T14:00'),
  'confirmed',
  '',
  '10160743',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0a8923d6bfb74f65475ea6cb5e4fdb05',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-13T15:00'),
  'confirmed',
  '',
  '10153354',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('fa0092a2d1b87a4c6dc64ffa0dffe53d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gogo ', 'zanelelanga@46gmail.com ', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a3423f7db82506240c720778b6f2089d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fa0092a2d1b87a4c6dc64ffa0dffe53d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-14T09:00'),
  'confirmed',
  '',
  '10135193',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a4790afc4a8185d470610fd3588c0699', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gogo ', 'zanelelanga@46.com.za ', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '632463593fc520a49b34420feea312f8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a4790afc4a8185d470610fd3588c0699',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-14T11:00'),
  'confirmed',
  '',
  '10135197',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('eb9a48fb8d19f57bd9d142c129e8f199', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keletso', 'keletsonokia@gmail.com', '0760200216', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd7412781860a53b277d265ef7e82a2be',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eb9a48fb8d19f57bd9d142c129e8f199',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-14T12:00'),
  'confirmed',
  '',
  '10117792',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3f17a652e6b54909bf9c8bd68a4d0788',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0205dedcc28ae14bab4b2b44c81be594',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-15T15:00'),
  'confirmed',
  '',
  '10165849',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c3db8dc3295cd22dcf3ea46b5c49dbdd', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Aphile Thango ', 'aphilethango73@gmail.com', '0719253217', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8d5c53c128437f92d4e60be498ca6539',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c3db8dc3295cd22dcf3ea46b5c49dbdd',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T09:00'),
  'confirmed',
  '',
  '10169237',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('38560004862a93b606ca3e08ef47afac', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thato Mapitso ', 'thatomapitso@gmail.com', '0789027360', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9b19ad600c17941521986d0be1923161',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '38560004862a93b606ca3e08ef47afac',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T10:00'),
  'confirmed',
  '',
  '10166582',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('efdca19ef743d5cfb147be95a8727015', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kate Monatshe', 'katemogano@gmail.com', '0606224054', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'db27566629e92accd8cad93b38ffa070',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'efdca19ef743d5cfb147be95a8727015',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T11:00'),
  'confirmed',
  '',
  '10173688',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a0a3ec22ac1af3474236605af5976b46',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cc4495f6d53f8ea57948035d44adf869',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T13:00'),
  'confirmed',
  '',
  '10169317',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '169831f5b359ec6d9097a382e980cc8b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a700270e6f648f0bee246b600c95de5a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T14:00'),
  'confirmed',
  '',
  '10171725',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f3e6b030dd7fab4313538b6afa0a0da1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-18T15:00'),
  'confirmed',
  '',
  '10165323',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e890e0adc14534f444caa34c2a3d04b4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '12de260c010b3db0b4537c11fe56b4ed',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T09:00'),
  'confirmed',
  '',
  '10168499',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '50db934be558ddf717da604bf1e1ec72',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6eb4a51149c8adcf395c5dc51f703bff',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T10:00'),
  'confirmed',
  '',
  '10162337',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5a3dd9b1e97a6d7c539f6d3d2c8b8b54', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Omphile', 'masanaboomphile@gmail.com', '0713966732', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bc70ae7e92d03e2b71225fd5ef8b8217',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a3dd9b1e97a6d7c539f6d3d2c8b8b54',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T11:00'),
  'confirmed',
  '',
  '10169201',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3e0d89e2603c08c0c2d5b93f4c82cf50',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T13:00'),
  'confirmed',
  '',
  '10172678',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('761ffca1cda5a646331c577b5d6f648c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato ', 'maepalerato93@gmail.com', '0680539442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8eb1caa327d3c11fd97d49052f405953',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '761ffca1cda5a646331c577b5d6f648c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T14:00'),
  'confirmed',
  '',
  '10174926',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bbba523c498a57e578008d52fce7443f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-19T15:00'),
  'confirmed',
  '',
  '10172706',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fc90d82f539263aad78ad0dfb8618765',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fed9ac7acdd23ce375f4041e3ae05ff2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-20T10:00'),
  'confirmed',
  '',
  '10165356',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f946f7da08d75bc216225232807d3e75', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reagile Petja ', 'ragipetja@gmail.com ', '0658724816', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fa1bafacbea1137dcde6f45f8bd0a566',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f946f7da08d75bc216225232807d3e75',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-20T11:00'),
  'confirmed',
  '',
  '10164726',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '493e5e344c1e8aab7152ef00c59b2517',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c74fad3a190f2606608d5ca20c1e4c0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-20T13:00'),
  'confirmed',
  '',
  '10166943',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ac7ad5ec6951bcc98b5b9a79ff595670',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a400b3ab21c6d007d0edaf4e4e746399',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-20T14:00'),
  'confirmed',
  '',
  '10170744',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '65cff50ac92dcfda0ca06de93c37d191',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7ca7941c3d112ed9e3286557dcd49703',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-20T15:00'),
  'confirmed',
  '',
  '10174836',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7dd21b53fe21246a888e0cb928ac3d0f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-21T09:00'),
  'confirmed',
  '',
  '10173100',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0b2c71ea7148da38df6722de720134ea',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-21T11:00'),
  'confirmed',
  '',
  '10166998',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5f5b489b7e3e31a214edde7a06847b5e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-21T12:00'),
  'confirmed',
  '',
  '10175892',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a5a75b12a3c5eaa7c5e235d34718e76f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nkosiyazi', 'nkosiyazpenelope@gmail.com', '0793171741', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5a5002abcab6340ad6fa261e279b6a01',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a5a75b12a3c5eaa7c5e235d34718e76f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-22T09:00'),
  'confirmed',
  '',
  '10182998',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '13f831a60774fe28e46e7e8bce942ad3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd34182e51f4c5edc0984c96bb598bba9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-22T11:00'),
  'confirmed',
  '',
  '10182413',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7287fa0edcf7655e2ee49948c711a1b6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Khanyisile ', 'khanyibabedi1115@gmail.com', '0720825412', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cc41c975aab786bbd9224daa01276d1e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7287fa0edcf7655e2ee49948c711a1b6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T09:00'),
  'confirmed',
  '',
  '10193748',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dd712e39635870851a4041d3fd9a3b61',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T10:00'),
  'confirmed',
  '',
  '10188665',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1363683f03e3b1c393636a2d46738861', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Fency Sono ', 'fencybunhle8@gmail.com ', '0679415060', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '414c11f1fea916967ae42b577f28a4a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1363683f03e3b1c393636a2d46738861',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T11:00'),
  'confirmed',
  '',
  '10194572',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd793478c41855666700bb2155ee5f22a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T13:00'),
  'confirmed',
  '',
  '10188020',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('19b060b3348b4fd62422848905579aa6', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Busilelo ', 'busilelokgaogelo@gmail.com', '0662184155', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd5ba45ee1b66fd20a34d8b9eaeab237a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '19b060b3348b4fd62422848905579aa6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T14:00'),
  'confirmed',
  '',
  '10186503',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '64a567b9e5e15b0ea291aa3bf0f2c978',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-25T15:00'),
  'confirmed',
  '',
  '10183637',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f32556db4a7d1f81dadcebb4205b4375',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T09:00'),
  'confirmed',
  '',
  '10188024',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c0a71dd82c5b28bb557d337329f2d5e2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lethabo', 'booysenlethabo@icloud.com', '0691524569', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd4f237532ac05ade86ed6e88c514a537',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c0a71dd82c5b28bb557d337329f2d5e2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T10:00'),
  'confirmed',
  '',
  '10185749',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'eb867d2f365760626688f0e4515ec8a8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b88d64966f0aa4d24a0be08de6bd9a91',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T11:00'),
  'confirmed',
  '',
  '10177989',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '184388c79f5ee5d7f83bc46b941cdf2b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '088eec6f089005db82a2ea617411f822',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T13:00'),
  'confirmed',
  '',
  '10185955',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '92c0ca3aa90d63035e87359d48491c0c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '63fbc11f8e7813b9f64ff5852297061e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T14:00'),
  'confirmed',
  '',
  '10177355',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bb916acdef9b23c395ed8abc2a26ff94',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '97c29382984fe4a33c394aa249cb363f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-26T15:00'),
  'confirmed',
  '',
  '10144362',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '88a20d61e0b1a30724efe27589da17fd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2b1fff2c42274087b007c4649ba71990',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-27T10:00'),
  'confirmed',
  '',
  '10191230',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a433cdb7230f73c008c1ccb983778f91', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thoriso', 'thorisokamogelo6@gmail.com', '0637519588', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7b4a9829b8f8ee14b37bc26b92509857',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a433cdb7230f73c008c1ccb983778f91',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-27T11:00'),
  'confirmed',
  '',
  '10192975',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9d9f02123fd1c0006e1952c6cf09f29f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ab50040e04c8c646dd54fedaa5c24bda',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-27T13:00'),
  'confirmed',
  '',
  '10192364',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6a4d309eaf7b6767b21639f7c9ed29d5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Queen Mudzanani ', 'mudzananiqueen8@gmail.com ', '0698706625', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5c3086359f34815459025e51e071acdb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6a4d309eaf7b6767b21639f7c9ed29d5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-27T14:00'),
  'confirmed',
  '',
  '10197537',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '506a5d2d8fea54ea150727e03f54caaf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f886ae26cd26d4283e6c336259402da8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-27T15:00'),
  'confirmed',
  '',
  '10200009',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3467c1ebdad4c686a8986becfa633882', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pontsho', 'bontletema2016@gmail.com', '0765035652', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '25801e9c3520c4f9299790c7536e3f52',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3467c1ebdad4c686a8986becfa633882',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-09-28T11:00'),
  'confirmed',
  '',
  '10202720',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('80da7f91e08d7c6cdfa317f1a57628a3', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'StephyM', 'stephinamaodi@gmail.com', '0715734425', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5947a14b8fb65acfd264120139a8ea39',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '80da7f91e08d7c6cdfa317f1a57628a3',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T09:00'),
  'confirmed',
  '',
  '10208446',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a8f36573a22bc0df1fc2f4d4e4ae7653', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Reneilwe', 'tsowntsow@gmail.com', '0727902461', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ffe986461f2938fff20110f555099f12',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8f36573a22bc0df1fc2f4d4e4ae7653',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T10:00'),
  'confirmed',
  '',
  '10194585',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c1b953e1e6ae71d5ce66628fcdc827f7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato ', 'setatilerato27@gmail.com', '0695078521', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c3404cfe2a7f086c3b07734c4e9904d7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c1b953e1e6ae71d5ce66628fcdc827f7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T11:00'),
  'confirmed',
  '',
  '10177236',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dc12a126f0dd40c0d97bbbfa8f7950d3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T13:00'),
  'confirmed',
  '',
  '10212842',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7f92a6e7af077c90d71aca4acc750f5f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T14:00'),
  'confirmed',
  '',
  '10204984',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('1399d2f962a9bead11d0f558330dd5f9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Amogelang Modisenyane', 'amomodisenyaned@icloud.com', '0812117810', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cbd85dcec29f6c216fa7838edd386321',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1399d2f962a9bead11d0f558330dd5f9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-02T15:00'),
  'confirmed',
  '',
  '10199990',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '846f6a9e759cca38d01ce5aa0b08c857',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T09:00'),
  'confirmed',
  '',
  '10208791',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5aeb876a8c3a7e541447169c4bf71dae', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Fundiswa', 'lindafundiswa@gmail.com', '0814512590', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3382efc52203c8ac8c5be8d2d1d35551',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5aeb876a8c3a7e541447169c4bf71dae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T10:00'),
  'confirmed',
  '',
  '10210581',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '97a9fbd662a3b3b67b0b3d7522f4dfe4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24801ce1d66d3b853f95d318b3bf04ef',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T11:00'),
  'confirmed',
  '',
  '10210405',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fd74adb6466c00d5af1f8367d4f7be66',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a5f5c6292570e1727c0731533ef1f593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T13:00'),
  'confirmed',
  '',
  '10182510',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7092941b0de1d271302dcbffde3461d1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '876dbb3a3d3560642d26e9520eccf141',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T14:00'),
  'confirmed',
  '',
  '10205430',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '32c1f56dd8bb5fdeba6eb198f2ba31f6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'bdfed9686d7949beed5e441273217c04',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-03T15:00'),
  'confirmed',
  '',
  '10149886',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f35313d1127b3a8b62aead9b332d2afa',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e541738ae99e708fa39be78a163cdb05',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-04T10:00'),
  'confirmed',
  '',
  '10207110',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '69a284e00e2eff3eb31389737c7c2da5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7ca7941c3d112ed9e3286557dcd49703',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-04T11:00'),
  'confirmed',
  '',
  '10210715',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '46b13416172603bfe38c8958495fc9f4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b9b589ef13f1f72de41e4ac09309b4fe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-04T13:00'),
  'confirmed',
  '',
  '10213067',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b6768c9ea2d1e62d09b31779a90d5019',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '088eec6f089005db82a2ea617411f822',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-04T14:00'),
  'confirmed',
  '',
  '10215959',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f8ffe85878e6ac0cfa357559a3727f25', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Didintle ', 'motsepedidintle26@gmail.com', '0635341679', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4426b3c4594b17a5f9569d5061f3dff3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f8ffe85878e6ac0cfa357559a3727f25',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-04T15:00'),
  'confirmed',
  '',
  '10202755',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5e0f649db4cc49e84d8d9d73da1f8740', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshepiso Mokgoma', 'tshepisowlekgolane@gmail.com', '0828314490', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5ee28a1aaa9b4ce948a171a14ef60273',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5e0f649db4cc49e84d8d9d73da1f8740',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-05T09:00'),
  'confirmed',
  '',
  '10208949',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8f1abaa0e718a28a15eb4cf959c95ac7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Boikanyo Kegomoditswe Sithole', 'kegowboikanyo52@gmail.com', '0672922429', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1d5fd373ffe643b451a441f2c8f17362',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8f1abaa0e718a28a15eb4cf959c95ac7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-05T11:00'),
  'confirmed',
  '',
  '10215683',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '93e45a33b6ba030c21b0f48e487c8bd9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '16ac9495abba3ae094023816aef2c549',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-05T12:00'),
  'confirmed',
  '',
  '10202880',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3cbe59452b252b6a4265e7ffbec168ee', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Morongwa Pilusa', 'angelmorongwa15@gmail.com', '0606523247', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b12ff1a9d5681f9b351b115236cd5f8b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3cbe59452b252b6a4265e7ffbec168ee',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-06T14:00'),
  'confirmed',
  '',
  '10217221',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('e3a21844bced58d835d1ddf6a1ced99a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sibongile Moloi ', 'moloipuseletso88@gmail.com', '0834589359', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd6c501902924d29b051e46bb15ed634a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e3a21844bced58d835d1ddf6a1ced99a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-09T09:00'),
  'confirmed',
  '',
  '10221168',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd3e50c2c617bb57c51c8ca42a611d594',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-09T10:00'),
  'confirmed',
  '',
  '10226843',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '73c5c5dda307f34cbf13e1658ba38916',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-09T11:00'),
  'confirmed',
  '',
  '10236749',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b770e18aa65526907b2205d57e6ec26a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '17ead54cb4bf6520882a425575002600',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-09T13:00'),
  'confirmed',
  '',
  '10234708',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f16b8fb02ece5253a5261d10fd58d944',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8b2994d427c60b82e1f0bcd1bd3144d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T09:00'),
  'confirmed',
  '',
  '10230921',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a4cc8578d39dc49abff10243d62c577a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T10:00'),
  'confirmed',
  '',
  '10236735',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dcb928108b07d7fcf02610b5f2892d9a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1363683f03e3b1c393636a2d46738861',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T11:00'),
  'confirmed',
  '',
  '10240719',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('03a3982878c9a000027810eaf95e3277', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng ', 'nthabisengmokone@gmail.com', '0820624963', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2774bac5e2fb5652adae4819d0f746f7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '03a3982878c9a000027810eaf95e3277',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T13:00'),
  'confirmed',
  '',
  '10235655',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('46949f2a4cfeda0cf67210dd0587b490', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Matlhodi', 'matlhodimatjane8@gmail.com', '0725552245', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '10b11a33625693a702483a44fb98c0b7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '46949f2a4cfeda0cf67210dd0587b490',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T14:00'),
  'confirmed',
  '',
  '10221711',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9b692c2216e17258b7eb5ff07cff7bab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd6a46f0aef0519d0e7d08734ef5b7d9b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-10T15:00'),
  'confirmed',
  '',
  '10235000',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('521da6c6290a9686abcd96b5cfbf0fab', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Sinethemba Queen Mapahangq ', 'indoniswati@gmail.com', '0764492790', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e13dcfe7ce889002932f5d207c96b5da',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '521da6c6290a9686abcd96b5cfbf0fab',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-11T10:00'),
  'confirmed',
  '',
  '10221433',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '659a4f26ce0442b97a9c18c65f4de86f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a5f5c6292570e1727c0731533ef1f593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-11T11:00'),
  'confirmed',
  '',
  '10244211',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cf81fb57a92c530ec01bba8c2139f317', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Keitumetse ', 'keitumetsevmmako@gmail.com', '0609083596', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e37ab12caf7f624b923d88b2c58eeaac',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cf81fb57a92c530ec01bba8c2139f317',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-11T13:00'),
  'confirmed',
  '',
  '10237470',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8ef663b45dcf618415f5280b442f1c02', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lehlogonolo Thubakgale ', 'hlogithubakgale@icloud.com', '0769645804', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4f72f8bbf9f4ccaafdafc68be35894b1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8ef663b45dcf618415f5280b442f1c02',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-11T14:00'),
  'confirmed',
  '',
  '10242486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '570f6aedd46f4d9cfd2945b796b3cd8d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7c594431ce1109a5297fd5adbf98539',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-11T15:00'),
  'confirmed',
  '',
  '10239221',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('02c82a1e1e5c188a8a1c07103b9ff257', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato', 'maepalerato93@iclod.com', '0680539442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '15e09ba55af5c4cc45a12af252b81d84',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '02c82a1e1e5c188a8a1c07103b9ff257',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-12T09:00'),
  'confirmed',
  '',
  '10245943',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fef8d7f2d0592bc735e268b25ade0bd8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a700270e6f648f0bee246b600c95de5a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-12T11:00'),
  'confirmed',
  '',
  '10245904',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9f61b1031296d1f30b0fe118c39b9674', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Tshepang ', 'khensanimashigo6@gmail.com', '0658832365', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a9c594cce0d2f74cc0de47b23e66a59e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9f61b1031296d1f30b0fe118c39b9674',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-12T12:00'),
  'confirmed',
  '',
  '10238969',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('58179135350d0da59e7b736402bf870c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zinhle', 'janezimaro@gmail.com', '0827524647', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'be34d6845c1c084154842a07044bdd3d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '58179135350d0da59e7b736402bf870c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-13T15:00'),
  'confirmed',
  '',
  '10247196',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5205fba56c1bf607526d5a1ce0151e14',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '615c548ddcc53c8f3ff14cbe5ec4d601',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T09:00'),
  'confirmed',
  '',
  '10258431',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7c344684c9dcf438c3660d940dcccd8a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e95362855f881eaf34f4fa772a0c8ea0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T10:00'),
  'confirmed',
  '',
  '10259611',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '943337988e285d94372242297da4b15a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2b1fff2c42274087b007c4649ba71990',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T11:00'),
  'confirmed',
  '',
  '10258193',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '83b89658740c80678a5fb4455bd49ea6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e289ad6bc7559ca47951a34f6c2fcd77',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T13:00'),
  'confirmed',
  '',
  '10259637',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('605b45a6f2da7c6414bc18635506e048', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dipuo Kubayi', '0796532918.df@gmail.com', '0824109916', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '702001b280beea395df4fa5cfedd5c10',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '605b45a6f2da7c6414bc18635506e048',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T14:00'),
  'confirmed',
  '',
  '10259588',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '40fd30242e385107f5dc89c47956c349',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7577c6904aa3657107b6a8b53f1fbc7c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-16T15:00'),
  'confirmed',
  '',
  '10259636',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c5a6b84037d89d5d5b4b08133699e4f8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'xilah masonta', 'shilahlovedoniah@gmail.com', '0714494442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ad98081e87048fa60912dd35139006d6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c5a6b84037d89d5d5b4b08133699e4f8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T09:00'),
  'confirmed',
  '',
  '10250669',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2f2b11b2c8e36fc92edbfab5af68e870',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T10:00'),
  'confirmed',
  '',
  '10249819',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '76f639be0e57609844f4d3599be8c986',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a00fbca0f0775b55dfd9a9a8f83630ad',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T11:00'),
  'confirmed',
  '',
  '10256785',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3bd72a262d8a0ddfb2c0a395af0eb8ee',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8f36573a22bc0df1fc2f4d4e4ae7653',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T13:00'),
  'confirmed',
  '',
  '10258216',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '69452472b3562e7114d48884462c9662',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aca262867f63a60b66173c6820f0cef4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T14:00'),
  'confirmed',
  '',
  '10251129',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('da036ca8d08f4b2c29bf48b0007fc45c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nompumelelo ', 'mildredmahlangu1@gmail.com', '0659156786', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f0f9ec8eb0078cf7e84a15f07fc5778c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'da036ca8d08f4b2c29bf48b0007fc45c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-17T15:00'),
  'confirmed',
  '',
  '10257214',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('42512887dc562496ca37aa40859e53a2', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Naledi Tsawani', 'happy122999@gmail.com', '0609568056', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a1c063240e30bc9befd2848017e62d02',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42512887dc562496ca37aa40859e53a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-18T10:00'),
  'confirmed',
  '',
  '10202418',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('173215a716398164f62f86ee3b96249b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mandisa Sibanyoni ', 'mandisasibanyoni93@gmail.com', '0849276493', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd342e81f4d293b274c66941b1b3f7125',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '173215a716398164f62f86ee3b96249b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-18T11:00'),
  'confirmed',
  '',
  '10202369',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3ae522c609088320c2dcfe3b66265694', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Samantha Hlatshwayo', 'samanthanothile@gmail.com', '0739559121', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ae8c9c352a69c9a6c150d4a7e6372605',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3ae522c609088320c2dcfe3b66265694',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-18T13:00'),
  'confirmed',
  '',
  '10260243',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('cf1f3c44a99ad918d539c2933247a0c8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Boitumelo Moatshe', 'nonase678@gmail.com', '0674279189', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '64de86c795037baa2a42e5922132d344',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cf1f3c44a99ad918d539c2933247a0c8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-18T14:00'),
  'confirmed',
  '',
  '10265215',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '989aad589c365a38fb0354f59ea08fe9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b89e72d1c0276c758d9f4e1d3eb9da9a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-18T15:00'),
  'confirmed',
  '',
  '10265035',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '993352f2267d5097e589d8a38cdfd583',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09f0c15fac936a9097a822b3aa5ff74b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-19T09:00'),
  'confirmed',
  '',
  '10251859',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd7c2e9124c01db804a85b7e253e1f364',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '363c3e8e52739b62f40aa9d486770ba0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-19T11:00'),
  'confirmed',
  '',
  '10259652',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dd5684f0178cb17e089fb7fb9264a98d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-19T12:00'),
  'confirmed',
  '',
  '10259756',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9bde81e208d5e62f2ae5f68629257e77', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Boitumelo Lorrain Swandle', 'boity.swandle@gmail.com', '0662131684', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a0b03b9e080ed405636903526984e56a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9bde81e208d5e62f2ae5f68629257e77',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-20T09:00'),
  'confirmed',
  '',
  '10268342',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '44e8fc7acbe33a64d52c63304c2eb37e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-20T10:00'),
  'confirmed',
  '',
  '10267817',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c5c676c497ebc9761b56d85ec2364b69',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fc0fb9b3316fb3d5975ad0ac1525fa66',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-20T11:00'),
  'confirmed',
  '',
  '10267316',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('222d252fce4a1a7e6a4f95446e6f0364', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Busi Kgalane ', 'wbmgidi@gmail.com', '0824922687', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '18caaed07fce76dab1e870bc17a21607',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '222d252fce4a1a7e6a4f95446e6f0364',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-23T11:00'),
  'confirmed',
  '',
  '10260036',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1e1907bd0c45a1ff20bd115470c0dc27',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8b0469ee6594dbbbab45d19dc276c280',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-23T14:00'),
  'confirmed',
  '',
  '10276826',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '92f2309f9cdd9f45455238f61a4f37ed',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'e472442a3b755294abd039b4704b0008',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-23T15:00'),
  'confirmed',
  '',
  '10256555',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('78e1a4cff74f5b7febe9e98456dd57f5', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Onthatile ', 'gontse.motshabi475@gmail.com', '0647555234', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3a18b90ecb28f1cae8b510c7271dc5c3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '78e1a4cff74f5b7febe9e98456dd57f5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T09:00'),
  'confirmed',
  '',
  '10278297',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '16b17e55c8d13eb600d3eb501e6836cc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b62c13e96fe2ea3eef82017dc392933',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T10:00'),
  'confirmed',
  '',
  '10278436',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2a7010187c53ea9207a58232e48f1485',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '78e1a4cff74f5b7febe9e98456dd57f5',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T11:00'),
  'confirmed',
  '',
  '10278318',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('02e0300143922193dc8ae62136946df4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Prudence Kgaugelo Sibanyoni ', 'prudencekgaugelo051@gmail.com', '0767290230', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9b73704e868e6afdf331623c53948ccd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '02e0300143922193dc8ae62136946df4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T13:00'),
  'confirmed',
  '',
  '10274086',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d26987ac8708dbce98dfb520bc60c9eb', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nkhensani Mabunda', 'nkhensani289@gmail.com', '0693556933', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '52e3f58f48352fe8d6ebf9a8a2351ce2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd26987ac8708dbce98dfb520bc60c9eb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T14:00'),
  'confirmed',
  '',
  '10245740',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '86dc74c28130d7cbe0f1d34d761adc72',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '26b94086a762b07c16c23a0b044edf25',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-24T15:00'),
  'confirmed',
  '',
  '10267512',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '11eaa58872e642ba33c390b33f4612f0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c74fad3a190f2606608d5ca20c1e4c0',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-25T10:00'),
  'confirmed',
  '',
  '10255984',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0d45673d84981a0069dad00856e56ee1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2f1c5042511b8cc38435e417faef3b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-25T11:00'),
  'confirmed',
  '',
  '10278601',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e293ec7e1fd9ac3dd26460bcd846be93',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '43f0eedb05cee540330fc970cfedc3d9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-25T13:00'),
  'confirmed',
  '',
  '10276777',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '55778b0cb584e748bff65d1a985fd500',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-26T09:00'),
  'confirmed',
  '',
  '10270774',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('0c1e135e109b87ac08c21d6d6c9b4170', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Petunia ', 'petuinvestment@gmail.com', '0698030427', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8a3254f695e64fb4b78b399c2aa694bd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0c1e135e109b87ac08c21d6d6c9b4170',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-26T11:00'),
  'confirmed',
  '',
  '10285216',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ae1ca2e6bd577492bf799572fe4b8c27', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Alenda ', 'matshidishomiki@gmail.com', '0823912026', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0a1adf799805fb2a1158b8968b5fe0a8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ae1ca2e6bd577492bf799572fe4b8c27',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-26T12:00'),
  'confirmed',
  '',
  '10266947',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e51f1698b4a6bc13da938489107d48eb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a1b5db2c7885e0bec67b218f7619735',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-27T09:00'),
  'confirmed',
  '',
  '10287835',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7510741b85244b5dcc924e974cb36bab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-27T13:00'),
  'confirmed',
  '',
  '10289332',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c3578faa7961b2844158406c325633f6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '94d5897d71e986ffff0bd4053310d45f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T09:00'),
  'confirmed',
  '',
  '10297763',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d2487b6679f4e2c2ad169f378c8df02a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Marvelin Manganye', '', '+27712562097', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '805d24dc1c9b471313ffa232945a41c9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd2487b6679f4e2c2ad169f378c8df02a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T10:00'),
  'confirmed',
  '',
  '10299027',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bb9b33cbd80c4eff6ecde6b355d94445',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8480ad450d4bcdf261a3894fed98e99',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T11:00'),
  'confirmed',
  '',
  '10300670',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0a69c3ebc94dcd29b32139bde5bf4d93',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'efdca19ef743d5cfb147be95a8727015',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T13:00'),
  'confirmed',
  '',
  '10286803',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8a52814618ab522b9e365c9e5c94fe5e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T14:00'),
  'confirmed',
  '',
  '10278473',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f9f7762f83b9aba78f513b3f134f2af9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Bonolo Moalosi', 'nolijafta2@gmail.com', '0634862639', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b8e001ba8d9d677c3b9062f5191ef9ba',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f9f7762f83b9aba78f513b3f134f2af9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-30T15:00'),
  'confirmed',
  '',
  '10213558',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('6e8d5d620701b7c91cbbdc4ba3a22963', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Popsie Chihau ', 'popsie.chihau@icloud.com', '0828409141', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3cea8d836a94312245ebefd4c52d2fa5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6e8d5d620701b7c91cbbdc4ba3a22963',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T09:00'),
  'confirmed',
  '',
  '10289854',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '34d0e4c2f7bd46c27a06244c434f2317',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f4b725b4e5494141f42a94b8bf011382',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T10:00'),
  'confirmed',
  '',
  '10294788',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7553a056d31f04db0cdfa0a74f4e7fe7', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Matshidiso Makope', 'msmakope@gmail.com', '0832050555', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ecc9e6df8a786bf6f10fda21c71f6a8b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7553a056d31f04db0cdfa0a74f4e7fe7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T11:00'),
  'confirmed',
  '',
  '10297380',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4927f346fe25572705b5461bdad60981',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'faf7aee6b2356edd9f81b29642c0053d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T13:00'),
  'confirmed',
  '',
  '10270605',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '96988126dec89d6069827a47d510ebb4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c4336e3cebd5c2ee0de1b36f2d657d4e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T14:00'),
  'confirmed',
  '',
  '10292382',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('18321a3a1aa28cc809538cf3d483c0c4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Kedibone ', 'kedibonegetrude@gmail.com', '0781379673', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '03feb5ed1b92303a4bc7a918402a93b4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '18321a3a1aa28cc809538cf3d483c0c4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-10-31T15:00'),
  'confirmed',
  '',
  '10297507',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f2974d42d3718b43730c4d4b1f9eaa16', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nombali Malinga', 'malinganombali6@gmail.com', '0727332564', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9f1b77ad5244c1073500f707d97f2f18',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f2974d42d3718b43730c4d4b1f9eaa16',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-01T10:00'),
  'confirmed',
  '',
  '10256699',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'df13aeeb273bc92c032d9b8237fd2afd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5a98ba7de275388f80641727d7d3a8e6',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-01T11:00'),
  'confirmed',
  '',
  '10293350',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '60adc4e486286db10031a5950dae1b60',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-01T13:00'),
  'confirmed',
  '',
  '10304089',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0e366cf9c30951ffe94d492d6f9ab25f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-01T14:00'),
  'confirmed',
  '',
  '10302649',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '13ee121cc13869f48888457ee0d49bf7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0b16bc1bb6fa90d2807f51a6daa930d4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-01T15:00'),
  'confirmed',
  '',
  '10303563',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3ba64c4b18f63820f0b70ed270944c45', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Prinncess Shungube ', 'princessshungube@icloud.com', '0680083919', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '016cbe1a65e602a213ec6ea10b7309bf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3ba64c4b18f63820f0b70ed270944c45',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-02T09:00'),
  'confirmed',
  '',
  '10297535',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd48225b52a67910520ce622acb67f672',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c7ea8e54cf8ed085811c022b6bf2580f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-02T11:00'),
  'confirmed',
  '',
  '10303237',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('5809fba2d3be338d2ed25c3cf9020f05', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng ', 'keamogetse@gmail.com', '0615159341', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f09e9af9b174ce1845bbeaa0f8a09233',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5809fba2d3be338d2ed25c3cf9020f05',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-02T12:00'),
  'confirmed',
  '',
  '10301365',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2d52753a91984a0c8a12ad734be3e080', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Muneiwa', 'tshepisocelia04@gmail.com', '0769139791', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '72fe687cc41f36d2ffbb076d7d835cab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2d52753a91984a0c8a12ad734be3e080',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-03T09:00'),
  'confirmed',
  '',
  '10302747',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c5d8f775eba90a20f9c7188de48be519',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '377296d2c4c944991ea719e3e26e987a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-03T14:00'),
  'confirmed',
  '',
  '10304718',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd41a83ab84657ea1bcef441f71102386',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd3b3130bf945d4ca03b681e64945f1b1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-06T15:00'),
  'confirmed',
  '',
  '10308457',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5cb15792cc7a12529e1a2b7fa383bdcf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2bb782ca06120817676480dc85f21055',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T09:00'),
  'confirmed',
  '',
  '10317956',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '32078aeb572978a0d0f90c4de9e858d8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '615c548ddcc53c8f3ff14cbe5ec4d601',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T10:00'),
  'confirmed',
  '',
  '10325486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6818cf43936bbd8da4c16079f99ceca1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a400b3ab21c6d007d0edaf4e4e746399',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T11:00'),
  'confirmed',
  '',
  '10324982',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8d564e833eba43073a77fba69f77bf7d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nozipho Zwane', 'noziphozwane21@gmail.com', '076 169 1612', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a1f9f924916cfb631862d6f1c074cdfe',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8d564e833eba43073a77fba69f77bf7d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T13:00'),
  'confirmed',
  '',
  '10300833',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '777177d11346a573880f6521325d9572',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fa0092a2d1b87a4c6dc64ffa0dffe53d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T14:00'),
  'confirmed',
  '',
  '10323366',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '39cd263c8816c79e060c85e19363ca5f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86ad23ea0f7e984564832e2720551593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-07T15:00'),
  'confirmed',
  '',
  '10226020',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ab13806d6f587b9e923eda30a263fe06',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3ba64c4b18f63820f0b70ed270944c45',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-08T10:00'),
  'confirmed',
  '',
  '10312261',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '15381a98d55d3a48ea5a6d764b2fa216',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-08T11:00'),
  'confirmed',
  '',
  '10327762',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '51b35e59f4d1d8048259332a613b6703',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eb9a48fb8d19f57bd9d142c129e8f199',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-09T12:00'),
  'confirmed',
  '',
  '10330606',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2f893684ee21cc3e067454705aecdee1', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Khethiwe Khethiwe', '', '+27836936515', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '956d177e93bcab3c2dca40cbdee963fc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2f893684ee21cc3e067454705aecdee1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T09:00'),
  'confirmed',
  '',
  '10344097',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e6212607e14627fdabf1d2e6806d6f71',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2f893684ee21cc3e067454705aecdee1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T10:00'),
  'confirmed',
  '',
  '10344153',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b46f53305e45d4389f820cd9afa25939', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Orapeleng ', 'oramoroke32@gmail.com', '0723126185', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6b9240ca46d67e51a6d12bab14acf738',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b46f53305e45d4389f820cd9afa25939',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T11:00'),
  'confirmed',
  '',
  '10342724',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '47e7cd520a89150fd1a118094668d92d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b1e4615db7fd2ed063c5a80a6c5d7240',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T13:00'),
  'confirmed',
  '',
  '10341434',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c0e3ad431f6d12bfb8dd869f118a355d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '35c7cabfd61acf5579ff8d84d9150a6f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T14:00'),
  'confirmed',
  '',
  '10340570',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0f82db8e29155cba2d86df20bde46cea',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fed9ac7acdd23ce375f4041e3ae05ff2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-13T15:00'),
  'confirmed',
  '',
  '10310692',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9c631398b7a152da2148487f1e632762', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Therezamarema', 'therezamarema@icloud.com', '0685848406', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5f85bb823ddcaab7d277f140b6a4be7c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9c631398b7a152da2148487f1e632762',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T09:00'),
  'confirmed',
  '',
  '10342520',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8ccb615416f2c384c62091ba5fd13c4b', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Potso Moruka', 'morukapotso@yahoo.com', '0767307334', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9b29743a53fe789d7b4cc47121d46568',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8ccb615416f2c384c62091ba5fd13c4b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T10:00'),
  'confirmed',
  '',
  '10340526',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dbc3cf276d78801dc959ae3bb6844144',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '87355dadad87e133469c5829606cdebe',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T11:00'),
  'confirmed',
  '',
  '10343504',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7456fb96b771b9c411d48cfddfe40296',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '09f0c15fac936a9097a822b3aa5ff74b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T13:00'),
  'confirmed',
  '',
  '10341604',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('9e2c3472abdd8b1f41b121c348ebf27d', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Katlego', 'matsebakatlego@icloud.com', '0658092789', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '16270b0e355c56b31894385509abd80b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9e2c3472abdd8b1f41b121c348ebf27d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T14:00'),
  'confirmed',
  '',
  '10334002',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bcb52adb836480923485848f7bc8bfaf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cf1f3c44a99ad918d539c2933247a0c8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-14T15:00'),
  'confirmed',
  '',
  '10329411',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '5467a4ae022673ec809accf995279b94',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'eecba32ccb06b556a200dce1df5223b4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T09:00'),
  'confirmed',
  '',
  '10342996',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2c65141ebb3730e0c0406c88d0c29b96', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Yolanda ', 'yolandamangete@gmail.com', '0767257836', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b25489725cd2f37ab3004a6d9b4d83c4',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2c65141ebb3730e0c0406c88d0c29b96',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T10:00'),
  'confirmed',
  '',
  '10340277',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2dd4e1774871223e69ab4cfdaff86c15',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7ca7941c3d112ed9e3286557dcd49703',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T11:00'),
  'confirmed',
  '',
  '10343042',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('a8054a094d75c8f65fb03606df9d5ed4', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lungile', 'lengobeni@gmail.com', '0793250714', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1441d057ab028e610591cc68e843cb70',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8054a094d75c8f65fb03606df9d5ed4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T13:00'),
  'confirmed',
  '',
  '10340615',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('afd32fe8f2ce3bb48ece4f6e793d8458', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Noxiey', 'nokuthulazandy21@gmail.com', '0607816866', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '789d5f8b7bae800075feaaa241d050a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'afd32fe8f2ce3bb48ece4f6e793d8458',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T14:00'),
  'confirmed',
  '',
  '10350399',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '063bc467862f3084f4dee2e51f26a0ab',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '9c631398b7a152da2148487f1e632762',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-17T15:00'),
  'confirmed',
  '',
  '10342538',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '168857bdbb09fefb75c5adc149d9e19c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fa0092a2d1b87a4c6dc64ffa0dffe53d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-20T13:00'),
  'confirmed',
  '',
  '10365699',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a43eff5098f75182cd6cd2e8e3d41889',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ee0e9c104e34423ec56ff1d3ba173eb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-20T15:00'),
  'confirmed',
  '',
  '10365556',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '42a5c21eaaf0ad1452da8afa758474a6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-21T09:00'),
  'confirmed',
  '',
  '10349509',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('69479c37c86049c3b2c7aae5a33d5667', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Odirile ', 'odirileselepe4@gmail.com ', '0606366458', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cd92843ee555c1f1f085e310e6fc4fbc',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '69479c37c86049c3b2c7aae5a33d5667',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-21T10:00'),
  'confirmed',
  '',
  '10363987',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8518abf63b02eafd7b615696a137c678',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-21T11:00'),
  'confirmed',
  '',
  '10349528',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '67b86b5387c684f8b05da972f79a970f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'aca262867f63a60b66173c6820f0cef4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-21T13:00'),
  'confirmed',
  '',
  '10352733',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8299c64b47bc25319df6a6cfe5e5ea3c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-22T10:00'),
  'confirmed',
  '',
  '10328799',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f74416489c009bc3adc1df9f7cdb0580',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-22T11:00'),
  'confirmed',
  '',
  '10328816',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '005c882c555ddbb4462d547f95e311cb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'cbc28bfa2b3ed31693e693a673fcdbae',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-22T13:00'),
  'confirmed',
  '',
  '10328835',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('d7f8f7f867002d881727743f34cb043f', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Gontse', 'gontse.molapo@gmail.com', '0823166743', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b4989badf12c1aaa20ef1e2e91e14ec2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd7f8f7f867002d881727743f34cb043f',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-23T09:00'),
  'confirmed',
  '',
  '10365444',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f0e3ccdfd11752bfd78560813965cc74',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'd70e84b6f9678e3fd878a0feb7f57272',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-23T11:00'),
  'confirmed',
  '',
  '10366657',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c0eb3e839165edaa7b541fdb9adee32a', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntlale Reneilwe Hilda ', 'ntlalehildamashiane@gmail.com', '606651972', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '825a8d6bc4313ed7e6dd4e998ee5d7a8',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c0eb3e839165edaa7b541fdb9adee32a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-24T15:00'),
  'confirmed',
  '',
  '10368872',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4686dd89d579cb3d612f82ba4af4cae6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '605b45a6f2da7c6414bc18635506e048',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-27T11:00'),
  'confirmed',
  '',
  '10379986',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8908db01c3aa4042fb9ced43f4220df8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Mathapelo Sekele', 'mathapelosegoatane@gmail.com', '0794514103', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'c996e8691e71d65c1c2806920500b241',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8908db01c3aa4042fb9ced43f4220df8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-27T13:00'),
  'confirmed',
  '',
  '10374495',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c07e3b15404a1aea5d2c59c765ee4a49', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Thandeka Msiza', 'thandekamsiza13@gmail.com', '0719223775', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '2683f52bb0e5706cbb138ae33b0fd7b5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c07e3b15404a1aea5d2c59c765ee4a49',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-27T14:00'),
  'confirmed',
  '',
  '10371511',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6067ded5de806518a5c4ccfe0325b46b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f9f7762f83b9aba78f513b3f134f2af9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-27T15:00'),
  'confirmed',
  '',
  '10352289',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f19316a2c941fbe1229f70ddd3d1d322', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Dineo Tefo', 'tefodineo0@gmail.com', '0797954406', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '60d9ef86deff5e9a2345ab36a5c8446d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f19316a2c941fbe1229f70ddd3d1d322',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T09:00'),
  'confirmed',
  '',
  '10381855',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'a91f4312bdd680a6937c08131f1b65eb',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '073ae60c8e046cfe67849c5b847bfacf',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T10:00'),
  'confirmed',
  '',
  '10379097',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8294e8061bc857c9255a8a71d2e042b9', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lebogang ', 'lebogang.moitsi@yahoo.com', '0748655392', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '706cb6c7c4b084c985bd394122aea20f',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8294e8061bc857c9255a8a71d2e042b9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T11:00'),
  'confirmed',
  '',
  '10366215',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '41c09808f4b829cba3aad4e297bd762e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7f52a9f22124a4ada9551157c1d13c59',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T13:00'),
  'confirmed',
  '',
  '10374944',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ce8bb46a226e94606fcca79ae76d8a96', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lerato', 'maepalerato93@cloud.com', '0680539442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'dd6b78421bc1bdf8607a78e81695b18d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ce8bb46a226e94606fcca79ae76d8a96',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T14:00'),
  'confirmed',
  '',
  '10376612',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '9598d094de0d433d5494b4b30747b463',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '1c43892633b33d786d13598f22a4e711',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-28T15:00'),
  'confirmed',
  '',
  '10365206',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b9d00c8c85576b3a594520685e6ae9a0',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a400b3ab21c6d007d0edaf4e4e746399',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-29T10:00'),
  'confirmed',
  '',
  '10345997',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cedef8ff55d9e97415223ed9f299ed07',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '18321a3a1aa28cc809538cf3d483c0c4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-29T11:00'),
  'confirmed',
  '',
  '10374330',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '0523f4f8e7669f206adf684cc7b7f0d1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fe38f30e852de8f1eab1f67e4851dcb7',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-29T13:00'),
  'confirmed',
  '',
  '10374409',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c35e98be0d3c8b8f7d5baca619848175', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Akani Maluleke ', 'thelmanondie@gmail.com', '0632245470', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'de11fa52d9545571f7b3d126de7326f6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c35e98be0d3c8b8f7d5baca619848175',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-29T14:00'),
  'confirmed',
  '',
  '10379486',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ebc7b6dad07e740330c1fc2ce9982fdf',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ab50040e04c8c646dd54fedaa5c24bda',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-29T15:00'),
  'confirmed',
  '',
  '10383572',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e014b2e4de012aa77683b5063adad0b9',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0e3218a532750e2cd85747b3ba82f34b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-30T09:00'),
  'confirmed',
  '',
  '10297639',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bbe5b08029a792feefcf9aab109b9d3b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7b71be69f5bc3a5ab8025ff9007bf1a1',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-30T11:00'),
  'confirmed',
  '',
  '10350560',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('36cec789d82661fdfb4ad4d527db9958', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Nthabiseng ', 'nthabisengmoukangoe@gmail.com', '0713288390', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '330ea64c4ac8adc29a92b5b5f2c17a18',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '36cec789d82661fdfb4ad4d527db9958',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-11-30T12:00'),
  'confirmed',
  '',
  '10299059',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('7cbcd08a0963185b9d53c3802d3ba5f8', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Rethabile', 'rethakhoza@icloud.com', '0712615340', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '37f635ea83903f97c37176904872651d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '7cbcd08a0963185b9d53c3802d3ba5f8',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-01T10:00'),
  'confirmed',
  '',
  '10392913',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '811c7224a9e1c81fc6c8c35c4665bf6d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-01T11:00'),
  'confirmed',
  '',
  '10392958',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('f4c03600527eea531eef0d128a8ef052', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Refilwe Makua ', 'kutwanemakua@gmail.com ', '0721878267', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '170575f136acb8a8d42c9fef8460ddb6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'f4c03600527eea531eef0d128a8ef052',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-01T13:00'),
  'confirmed',
  '',
  '10392222',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fb67113b83b7c006748e8d9f0959a984',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6c636abcc21b33b23f1f177a9184ca81',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-01T14:00'),
  'confirmed',
  '',
  '10387815',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('ebca3ce0e613550736e202ea7fee5464', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Pearl Nukeri', 'nukeripearl@gmail.com', '0658372442', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'bd587b7afc2f6c3e8c4e89718d21241a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'ebca3ce0e613550736e202ea7fee5464',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-01T15:00'),
  'confirmed',
  '',
  '10392459',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e5bca1df6aee733867296b9b9a997848',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T09:00'),
  'confirmed',
  '',
  '10402308',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('89a2496fa23cea4cbb779ce843f1f4da', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Cecelia', 'mongwececelia@gmail.com', '0731615819', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1cca07a4d914dd304c76d2040bc87938',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '89a2496fa23cea4cbb779ce843f1f4da',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T10:00'),
  'confirmed',
  '',
  '10388158',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e7c2a5bf0bcbb6ba7b8ee22af89e5af1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '6b589d999886bf2a3426181d4c577706',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T11:00'),
  'confirmed',
  '',
  '10405131',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '138a4e3240a75260602e2d32c8afb8fd',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '343dd0c9320aec338038535e33b9209a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T13:00'),
  'confirmed',
  '',
  '10403453',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'cb1641e7658d765d9f30c744a8536ca1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '5cac9138155bd3f67afa02e72434fa3a',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T14:00'),
  'confirmed',
  '',
  '10395919',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('2e139578d7dfdc97f7155f4b8a657295', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ella Maswanganye', 'kgomotsoella25@gmail.com', '0623275401', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '74567545060bb1f16f9e2d57e7d39ae1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2e139578d7dfdc97f7155f4b8a657295',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-04T15:00'),
  'confirmed',
  '',
  '10392929',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ece14dbdfda9ffbe59c7412edcc50390',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a8f36573a22bc0df1fc2f4d4e4ae7653',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T09:00'),
  'confirmed',
  '',
  '10379774',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '19a1cbe1182e2d8112a5c7aad355f4b6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '2e139578d7dfdc97f7155f4b8a657295',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T10:00'),
  'confirmed',
  '',
  '10385665',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '6d5e91e2bf73ff1705e2c2342c72f8f7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a00fbca0f0775b55dfd9a9a8f83630ad',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T11:00'),
  'confirmed',
  '',
  '10389346',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'ae944b2163a702a15fc48ecd279de9d7',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '86ad23ea0f7e984564832e2720551593',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T13:00'),
  'confirmed',
  '',
  '10382861',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3ba4f6ab4a95e86c1afdcca7fb723336',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '71584128d496c9a9648c01b8421fe454',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T14:00'),
  'confirmed',
  '',
  '10394997',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('db460e4246d75f20c77856f56959f8eb', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Ntsiki', 'ntsikisekgobela@gmail.com', '0677906063', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '1ecb4f1e1efa14ff7ed68b643e306fc2',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'db460e4246d75f20c77856f56959f8eb',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-05T15:00'),
  'confirmed',
  '',
  '10387631',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('083ce976a95856ec12a3e45f7cb4cf29', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'motlalethabo Gloria ', '', '0660178779', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '975415b4bf768dc9d6a8cadd46d2f1b5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '083ce976a95856ec12a3e45f7cb4cf29',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-06T10:00'),
  'confirmed',
  '',
  '10379782',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8ab1019976bb7d7a19103711628e5133',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fbc289a353ff8206eef5e43cdfce1345',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-06T11:00'),
  'confirmed',
  '',
  '10393046',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('8ca58667a511ca82db037bc7c869d789', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Regomoditswe', 'prudtmat@icloud.com', '0826663044', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b189a12edd828429141df6e52e7efd0c',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '8ca58667a511ca82db037bc7c869d789',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-06T13:00'),
  'confirmed',
  '',
  '10393263',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('c559d70b26789110b7a0eea6f26340bd', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Oreabetse', 'monenematloa@gmail.com', '0791796313', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '67541da1196233a2dd7492ec8acdf8ff',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'c559d70b26789110b7a0eea6f26340bd',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-06T14:00'),
  'confirmed',
  '',
  '10393269',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '46c6aa5eda4071a770c986397e418782',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'a473e390649dc120772a32efec06e9b9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-06T15:00'),
  'confirmed',
  '',
  '10393395',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8c39d924d73ed1acc0024cd438ebe0b1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'de8bab725160f59832e7cdcceca23da9',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-07T09:00'),
  'confirmed',
  '',
  '10384023',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fdc2e04f1e371d968e74457b84c6c80b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '761ffca1cda5a646331c577b5d6f648c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-07T11:00'),
  'confirmed',
  '',
  '10398894',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b0f2d87f49f032057893bbc9ea92942e', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Zanele Langa ', 'zanelelelanga@46gmail.com ', '0647696159', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4d9448044ad517d087ff4a42f5565661',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b0f2d87f49f032057893bbc9ea92942e',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-07T12:00'),
  'confirmed',
  '',
  '10406523',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '7d6a8585733a0ca6f5545e5853f50ba1',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0205dedcc28ae14bab4b2b44c81be594',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-08T13:00'),
  'confirmed',
  '',
  '10410409',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '8967a8ef3c4d9a500fb0d0e2538e52b3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0205dedcc28ae14bab4b2b44c81be594',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-08T14:00'),
  'confirmed',
  '',
  '10410438',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4a6bb8e6f3b8c8edbec4c85318058043',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-11T10:00'),
  'confirmed',
  '',
  '10410481',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'd8d21e6af6150c09047479220b143c55',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '4a8082b779e2dd1dec8ae9c5ddaf5559',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-11T11:00'),
  'confirmed',
  '',
  '10410489',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('3b8f0231060eaeb142f09573182d5e80', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Lesego ', 'lfmdlalose@gmail.com', '0827446881', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4e5ef35ed4a903bcb70d56e6a57e6f64',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '3b8f0231060eaeb142f09573182d5e80',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-13T10:00'),
  'confirmed',
  '',
  '10404904',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'e7045f9c59887ecf9f46b03c44dddb34',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b3d493387caebf33c082ccc1fdbeaff4',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-14T09:00'),
  'confirmed',
  '',
  '10379494',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '120add57fc8a5ab3844033ee86a9077e',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'fed9ac7acdd23ce375f4041e3ae05ff2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-19T09:00'),
  'confirmed',
  '',
  '10407908',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b814463628a2600a95b786ea2e2290b5',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '24f6b7d61acedbbac208229fd13d590c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-19T13:00'),
  'confirmed',
  '',
  '10380097',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '40de824069b9dc08595ee68ecb1f4915',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '876dbb3a3d3560642d26e9520eccf141',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-19T14:00'),
  'confirmed',
  '',
  '10382616',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'b6b25d55b2521aa114769012c7eddc8d',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'faf7aee6b2356edd9f81b29642c0053d',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-20T13:00'),
  'confirmed',
  '',
  '10346287',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO users (id, tenant_id, name, email, phone, created_at, updated_at)
VALUES ('b985aa31a639d8b497a85193a163ef8c', 'ccb12b4d-ade6-467d-a614-7c9d198ddc70', 'Appreciate ', 'appreciatelebo2003@icloud.com', '0636934924', 1764954686, 1764954686);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '3cfe5cad95090ca9795845414f84320b',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  'b985aa31a639d8b497a85193a163ef8c',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-24T12:00'),
  'confirmed',
  '',
  '10403219',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'fd140fa937de492fd1003b061d3917d3',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '0e3218a532750e2cd85747b3ba82f34b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-28T09:00'),
  'confirmed',
  '',
  '10403102',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '4fa3582ed907977e90aedb68a461375a',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '42512887dc562496ca37aa40859e53a2',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-28T12:00'),
  'confirmed',
  '',
  '10399717',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  '49fba40f232489ea49d3ed88f7ab56c6',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '173215a716398164f62f86ee3b96249b',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-29T09:00'),
  'confirmed',
  '',
  '10399745',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);

INSERT OR IGNORE INTO appointments (
  id, tenant_id, user_id, service_id, scheduled_time, 
  status, notes, supersaas_booking_id, created_at, updated_at, 
  payment_status
)
VALUES (
  'f4f111752214618a5811b2842c5c86ca',
  'ccb12b4d-ade6-467d-a614-7c9d198ddc70',
  '876dbb3a3d3560642d26e9520eccf141',
  COALESCE((SELECT id FROM services WHERE name = 'General Appt' LIMIT 1), (SELECT id FROM services LIMIT 1)),
  strftime('%s', '2025-12-29T13:00'),
  'confirmed',
  '',
  '10382581',
  1764954686,
  1764954686,
  'paid' -- Assumption for historical
);