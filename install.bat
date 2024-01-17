
@echo off
echo Checking for requirements...
set /A check=1

node --version >nul 2>&1 && (
    @REM Checking for NodeJS
) || ( 
    echo NodeJS not found!
    set /A check=0 
)

cd ./fido2py
python --version >nul 2>&1 && ( 
    @REM Checking for Python and installing dependencies if Python was found
    echo Installing Python dependencies...
    pip install -r requirements.txt
) || ( 
    python3 --version >nul 2>&1 && (
        @REM Checking if Python3 is installed
        echo Installing Python dependencies
        pip install -r ./requirements.txt
    ) || (
        echo Python not found!
        set /A check=0  
    )
)

cd ../

npm --version >nul 2>&1 && (
    @REM Checking for NPM and installing packages
    echo Installing NPM packages...
    npm install
) || ( 
    echo NPM not found!
    set /A check=0
)

echo Installation done...

pause