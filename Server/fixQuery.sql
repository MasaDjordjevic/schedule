CREATE UNIQUE NONCLUSTERED INDEX idx_yourcolumn_notnull
ON UniMembers(studentID)
WHERE studentID IS NOT NULL;