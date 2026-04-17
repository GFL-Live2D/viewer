"""Binary reader for GFL STC file format (little-endian, length-prefixed strings)."""

import struct
from typing import Optional


class StcReader:
    def __init__(self, data: bytes):
        self.buf = data
        self.offset = 0

    def peek_byte(self) -> int:
        return self.buf[self.offset]

    def read_byte(self) -> int:
        val = self.buf[self.offset]
        self.offset += 1
        return val

    def read_bytes(self, n: int) -> bytes:
        val = self.buf[self.offset : self.offset + n]
        self.offset += n
        return val

    def read_int(self) -> int:
        val = struct.unpack_from("<i", self.buf, self.offset)[0]
        self.offset += 4
        return val

    def read_float(self) -> float:
        val = struct.unpack_from("<f", self.buf, self.offset)[0]
        self.offset += 4
        return val

    def read_string(self) -> Optional[str]:
        """Read 0x01-prefixed, uint16-length-prefixed UTF-8 string. Returns None if marker absent."""
        if self.offset >= len(self.buf) or self.buf[self.offset] != 0x01:
            return None
        self.offset += 1
        length = struct.unpack_from("<H", self.buf, self.offset)[0]
        self.offset += 2
        text = self.buf[self.offset : self.offset + length].decode("utf-8", errors="ignore").strip()
        self.offset += length
        return text

    def read_string_strict(self) -> str:
        """Like read_string but raises on missing marker (for fields that must be strings)."""
        if self.offset >= len(self.buf):
            raise struct.error("EOF checking string marker")
        marker = self.buf[self.offset]
        if marker != 0x01:
            raise ValueError(f"Expected string marker 0x01 at offset {self.offset}, got 0x{marker:02x}")
        self.offset += 1
        length = struct.unpack_from("<H", self.buf, self.offset)[0]
        self.offset += 2
        text = self.buf[self.offset : self.offset + length].decode("utf-8", errors="ignore").strip()
        self.offset += length
        return text

    def skip_null_bytes(self):
        while self.offset < len(self.buf) and self.buf[self.offset] == 0x00:
            self.offset += 1
