# Xserver確認用サイト

公開予定URL: https://hanadamushin.xsrv.jp/fastneura-preview/

接続先: sv16386.xserver.jp、ポート10022、ユーザーhanadamushin。
公開先はログイン先ホーム内の hanadamushin.xsrv.jp/public_html/fastneura-preview。
この公開先の実在、使用可否、HTTPS表示は初回実行前後に確認する。

## 初回設定

Repository Settings → Secrets and variables → Actions に登録する。

- XSERVER_SSH_KEY: Xserverで作った専用秘密鍵の全文（チャットや通常のファイルに貼らない）。
ED25519のホスト鍵フィンガープリントは、Xserver管理画面でユーザーが確認した値をworkflow内に固定済み。秘密情報ではない。

GitHub上の変更をmainへ反映後、Actions → Deploy Xserver preview → Run workflowを選択する。
main以外を指定した実行はスキップされる。コミットだけではアップロードされない。
初回は対象フォルダが確認用として使用可能なことを確認してから実行する。

接続がタイムアウトした場合は、XserverのSSHアクセス制限（IP・国外）と鍵の登録状態を確認する。
GitHubの標準実行環境は海外から接続することがある。制限は自動で解除しない。
接続元の許可方法を検討し、必要なら国内の実行環境を使用する。

## 公開範囲とバックアップ

現在の9ファイル（index.html、members.html、nayuta-mizuguchi.png、ceo-ink-background.png、style.css、members.css、ui.js、wave-theme.css、wave.js）だけを送信する。
追加した画像等は送信対象に追加する必要がある。
確認用に検索エンジン向けnoindexヘッダーを付けるが、閲覧の制限にはならない。

既存の確認用フォルダは更新前にホーム直下の .fastneura-preview-backups に退避する。
古いバックアップや送信先の余分なファイルは自動削除しない。
アップロードはファイル単位であり、一括切り替えではない。失敗時は一部だけ更新される場合がある。

## 初回確認と今後

Actionsの成功はファイル転送の完了を示す。ブラウザで表示、CSS、アニメーション、リンクを別途確認する。
本番ドメインfastneura.comへのDNS変更、移管、メール設定の変更はこの設定には含まれない。
本番公開時は専用の公開先を確認し、確認用のnoindexを引き継がない。
自動更新を有効にする場合は、初回確認後にmainへのpushを起動条件に追加する。
