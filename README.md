## Определиться с используемым инструментарием для реализации проекта
В данном проекте мы будем использовать следующие инструменты:
1. Операционная система - Windows 10
2. IDE - WebStorm
3. PostgreSQL - будет установлен на прямую в IDE. Установщик скачивается с официального сайта и устанавливается по инструкции\
Настройка для подключения к БД будет осуществляться через локальные файлы.
Так же установлены следующие зависимости:
- `pg` - библиотека для взаимодействия с PostgreSQL.
- `pg-hstore` - библиотека для работы с hstore
- `sequelize-cli` - библиотека для работы с миграциями

Данный метод был выбран потому что:
1. Установка PostgreSQL напрямую в IDE проще настраивается. Нет необходимости в дополнительных настройках.
2. При использовании личного ПК прямая установка может обеспечить лучше производительность, так как нет дополнительных слоев виртуализации.
3. Имеется прямой доступ к файловой системе
4. Так же нет необходимости в контейнеризации.

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
