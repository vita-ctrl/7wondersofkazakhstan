from concurrent.futures import ThreadPoolExecutor

# Создаём пул один раз при старте
executor = ThreadPoolExecutor(max_workers=4)
