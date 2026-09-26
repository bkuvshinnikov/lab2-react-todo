# Деплой на Vercel

Проект не требует отдельного `vercel.json`: Vercel автоматически определяет
Next.js и использует `next build`.

1. Закоммитьте и отправьте проект в GitHub.
2. Откройте [vercel.com/new](https://vercel.com/new), выберите GitHub и нажмите
   **Import** рядом с репозиторием.
3. В настройках проекта оставьте Framework Preset `Next.js` и Root Directory `/`.
4. В разделе Environment Variables добавьте для `Production`, `Preview` и
   `Development`:

   ```text
   MONGODB_URI=<строка подключения Atlas>
   MONGODB_DB=task_manager
   ```

   Значения не добавляются в Git и не должны иметь префикс `NEXT_PUBLIC_`.
5. Нажмите **Deploy**.

В Atlas откройте **Network Access** и добавьте IP-адреса Vercel. Для учебного
проекта можно временно разрешить `0.0.0.0/0`, но это открывает сетевой доступ
ко всем адресам; используйте отдельного пользователя БД с минимальными правами
и не публикуйте connection string. После деплоя проверьте регистрацию, вход,
выход и изоляцию задач двух пользователей в production.

Каждый push в подключённую ветку создаёт новый deployment. Preview deployments
используют те же переменные окружения, если они добавлены для Preview.
