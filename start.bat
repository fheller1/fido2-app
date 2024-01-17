echo Starting backend...
call python fido2py/server.py
if %errorlevel% NEQ 0 (
    call python3 fido2py/server.py
)

echo Starting frontend...
call npm start