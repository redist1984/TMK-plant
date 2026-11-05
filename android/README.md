# Завод TMK — Android-приложение

WebView-обёртка вокруг того же сайта, что публикуется на GitHub Pages. Всё
приложение — одна активность: `MainActivity` показывает `index.html` из
внутреннего хранилища и отдаёт PDF системному просмотрщику.

## Что важно понимать

**Контента в этом каталоге нет.** `app/src/main/assets/www/` собирается из
корня репозитория скриптом `tools/build-android-assets.js` и в git не
хранится (см. `.gitignore`). Поэтому:

* единственный источник правды — корень репозитория;
* правка сайта автоматически попадает в следующую сборку APK;
* отдельно синхронизировать ничего не нужно.

**Сеть не используется.** Разрешение `INTERNET` не запрашивается: страницы,
фото и PDF лежат внутри APK. Обновление содержимого — только новой версией
APK.

## Локальная сборка

Нужны JDK 17+ и Android SDK (platform 34, build-tools 34), плюс **Node** для
сборки контента. Python не требуется.

```powershell
# из корня репозитория
node tools/build-android-assets.js      # контент -> android/app/src/main/assets/www

cd android
# путь к SDK, если Android Studio установлена нестандартно
#   local.properties: sdk.dir=C\:\\path\\to\\Android\\Sdk
$env:JAVA_HOME = 'D:\Android Studio\jbr'

.\gradlew.bat assembleDebug
# результат: app/build/outputs/apk/debug/app-debug.apk
```

`gradlew` сам подтянет нужный Gradle (9.6.0) и зависимости из google()/
mavenCentral(). Android Studio открывает каталог `android/` как обычный
проект; контент она собирает сама — задача `buildAssets` висит на `preBuild`
и вызывает `node tools/build-android-assets.js`. Если `node` не в PATH,
задайте путь: `NODE=C:\Program Files\nodejs\node.exe`.

## Версия приложения

`versionCode`/`versionName` не зашиты в `build.gradle` жёстко — их можно
переопределить:

```powershell
.\gradlew.bat assembleDebug -PversionCode=42 -PversionName=1.42
```

В CI они считаются из числа коммитов (`git rev-list --count HEAD`), поэтому
каждая сборка получает уникальный `versionCode` и может обновить
установленное приложение. По умолчанию в файле стоит `1`.

## Подписанный release

Release-APK должен быть подписан тем же ключом, что и предыдущий, иначе
Android не даст обновить установленное приложение. Ключ и пароли в
репозиторий не попадают:

`android/keystore.properties` (в `.gitignore`):

```properties
storeFile=release.keystore
storePassword=...
keyAlias=tmk
keyPassword=...
```

Положить рядом `android/release.keystore`. Если файла нет, `assembleRelease`
соберётся неподписанным — только для проверки, что сборка проходит.

## Что внутри

| Файл | Назначение |
|---|---|
| `app/src/main/java/com/tmkplant/app/MainActivity.java` | WebView, слепок контента в `getFilesDir()/www`, открытие PDF, яркость, полноэкранный режим |
| `app/src/main/AndroidManifest.xml` | одна активность + `FileProvider` (без `INTERNET`) |
| `app/src/main/res/` | иконки (адаптивная для 8.0+), тема, `file_paths.xml` |
| `app/build.gradle` | версия, подпись, задача `buildAssets` |
| `build.gradle`, `settings.gradle`, `gradle.properties` | AGP 9.0.1, репозитории |

## Ограничения

* APK получается ~198 МБ: 170 МБ из них — PDF-чертежи в `docs_pdf/`.
  Если понадобится уменьшить, PDF можно вынести из APK и раздавать
  отдельным архивом (сейчас они внутри, потому что приложение должно
  работать без сети).
* `compileSdk 34`; AGP 9.0.1 требует Gradle 9.x и JDK 17+.
