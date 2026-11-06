# 本番公開

公開先は https://fastneura.com/ 。
`.github/workflows/xserver-production.yml` が `main` へのpushと手動実行で起動する。
接続先は sv16386.xserver.jp:10022、ユーザー hanadamushin。
公開先はホーム内の `fastneura.com/public_html/`。

既存の `XSERVER_SSH_KEY` を利用し、管理画面で確認済みのホスト鍵を照合する。
SSHの国外アクセス制限がONだとGitHubの海外実行環境から接続できない場合がある。

送信対象はworkflowの明示リストにあるHTML・CSS・JavaScript・画像。
新しい素材を追加した場合は、このリストと確認用workflowのリストも更新する。
`.git`、秘密鍵、ドキュメントは転送しない。
`.htaccess`は転送しないため、Xserver側のHTTPS転送設定等を維持する。

公開前に既存のpublic_htmlをホーム内の `.fastneura-production-backups/` へ保存する。
バックアップと送信先の古いファイルは自動削除しない。
更新はファイル単位なので、処理途中や失敗時には新旧の版が混在する場合がある。

公開後はActionsの成功に加え、トップページ、メンバーページ、画像、HTTPSを確認する。
DNS・Googleメールの設定とSSL証明書の発行は、このworkflowでは操作しない。
