
with open(r'c:\Users\Matvey\Documents\Projects\CRZRT-Site\Документы\ТЗ_модуль_тестирования.md', 'rb') as f:
    data = f.read()

text = data.decode('utf-8')
print('Char length:', len(text))
print('Sample text start:')
print(text[:300])
