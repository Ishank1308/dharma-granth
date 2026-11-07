import ctypes
from ctypes import wintypes
import os

GENERIC_READ = 0x80000000
FILE_SHARE_READ = 0x00000001
FILE_SHARE_WRITE = 0x00000002
FILE_SHARE_DELETE = 0x00000004
OPEN_EXISTING = 3
FILE_ATTRIBUTE_NORMAL = 0x80

cookie_path = r"C:\Users\ishan\AppData\Local\Google\Chrome SxS\User Data\Profile 1\Network\Cookies"

handle = ctypes.windll.kernel32.CreateFileW(
    cookie_path,
    GENERIC_READ,
    FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
    None,
    OPEN_EXISTING,
    FILE_ATTRIBUTE_NORMAL,
    None
)

INVALID_HANDLE_VALUE = -1
if handle == INVALID_HANDLE_VALUE or handle == 0xFFFFFFFF:
    err = ctypes.GetLastError()
    print("CreateFile failed with error:", err)
else:
    print("CreateFile SUCCEEDED! Handle:", handle)
    # Read file content
    file_size = ctypes.wintypes.LARGE_INTEGER()
    ctypes.windll.kernel32.GetFileSizeEx(handle, ctypes.byref(file_size))
    print("File size:", file_size.value)
    
    buf = ctypes.create_string_buffer(file_size.value)
    bytes_read = wintypes.DWORD()
    success = ctypes.windll.kernel32.ReadFile(handle, buf, file_size.value, ctypes.byref(bytes_read), None)
    print("ReadFile success:", success, "bytes read:", bytes_read.value)
    ctypes.windll.kernel32.CloseHandle(handle)
    
    with open("temp_profile1_cookies.db", "wb") as f:
        f.write(buf.raw[:bytes_read.value])
    print("Saved temp_profile1_cookies.db successfully!")
