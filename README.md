# **App PORT**

## URL

https://stevesan-appport.herokuapp.com/<br><br>

## テスト用アカウント

email: test@test.com<br>
password: Qwe123123<br>
※自由に投稿していただいて構いません<br><br>

# 概要

他の人が製作したアプリの閲覧、<br>
またはユーザー登録することで自分の製作したアプリを投稿できます。<br><br>

# 利用方法

- All App

  縦スクロールで、それぞれのユーザーが投稿したアプリを閲覧でき、<br>
  横スクロールではそのユーザーが投稿した他のアプリを閲覧できます。<br><br>

- Login

  ユーザーの新規登録、またはログインができます。<br><br>

### **ログイン後**<br><br>

- My App

  自分が投稿したアプリを閲覧できます。<br>
  このページでアプリ情報の編集と削除ができます。<br><br>

- Add New App

  画像、タイトル、説明、URL を入力し、新しくアプリを投稿できます。<br><br>

# 使用技術

## **フロントエンド**

### 言語

- HTML&CSS
- Javascript(Typescript)

### フレームワーク&ライブラリ

- React
- Redux
- React Router
- tailwindCSS

### モジュールバンドラー

- webpack

## **バックエンド**

### 言語

- Javascript(Typescript)

### フレームワーク&ライブラリ

- Node.js(Express)<br><br>

## **データベース**

- MongoDB(ユーザー情報、アプリ情報の保存)<br><br>

## **ストレージ**

- AWS S3(画像の保存)<br><br>

## **セキュリティ対策**

- helmet(HTTP ヘッダー関係)
- bcrypt(パスワードをハッシュ化)
- passport-local / passport-jwt(ユーザー認証)<br><br>

# 実装予定

- Google 認証
- 登録メールアドレスの URL 認証
