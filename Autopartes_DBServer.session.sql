-- Cambiar usertype_idtypeuser de raul@gmail.com de 3 a 2
UPDATE users
SET usertype_idtypeuser = 2
WHERE email = 'raul@gmail.com';

