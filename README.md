## Определиться с используемым инструментарием для реализации проекта
В данном проекте мы будем использовать следующие инструменты:
1. Операционная система - Windows 10
2. IDE - WebStorm
3. PostgreSQL - будет установлен с официального сайта и будет использоваться через pgAdmin\
Так же установлены следующие зависимости:
- `pg` - библиотека для работы с PostgreSQL
- `pg-hstore` - библиотека для работы с hstore
- `node-pg-migrator` - библиотека для работы с миграциями

## Работа с Git
### Основные команды

- `git init` - инициализация репозитория
- `git clone <url>` - клонирование репозитория
- `git add <file>` - добавление файла в индекс
- `git commit -m "<message>"` - создание коммита с сообщением
- `git pull origin <имя_ветки>` - получение изменений из удаленного репозитория
- `git push origin <название_ветки_в_которой_находишся>` - отправка изменений на удаленный репозиторий
- `git status` - получение информации о состоянии репозитория
- `git log` - получение истории коммитов
- `git branch <имя_ветки>` - создание новой ветки
- `git switch <имя_ветки>` - переключение на другую ветку
- `git merge <имя_ветки>` - слияние ветки в текущую
- `git merge — abort` - отмена слияния
