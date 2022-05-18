# NextMoo!

Web version of the classic cowsay and cowthink commands, now with an API
endpoint.

This is a clone of the [Moo!][moo] project coded from scratch, this time
developed with [Next.js][nextjs] and deployed with [Vercel][vercel]. Many
issues have been solved and many improvements have been made.

Powered by [cowsayjs][cowsayjs].

```
 ______
< moo! >
 ------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```


## Website

Start to create and share custom cows here: https://nextmoo.vercel.app

Change the fields to customize the cow and use the `share` command in the
terminal to get the direct link to your custom cow and the `curl` commands to
make requests. See bellow for more details.

The `clear` command is usefull if there are many lines in the terminal and
you wan to clear it. The other commands are just for fun, use `help` to
see the full list.


## Custom website cows and API reference

You can share custom cows with a direct link to the website and request custom
cows on `text/plain` format from https://nextmoo.vercel.app/api with The `GET`
or `POST` methods.

Use the next parameters to customize your cow:

  - `message`: The message to be printed
  - `cow`: Cow name. Any of the name of [theses files][cows] without the
extension. Eg: `dragon` or `stegosaurus`.
  - `action`: `say` or `think`, the default value is `say`.
  - `mode`: The cow mode are predefined faces, leave empty to default face
`{"eyes":"oo"}`:
    - `b`: Borg `{"eyes":"=="}`
    - `d`: Dead `{"eyes":"xx","tongue":"U"}`
    - `g`: Greedy `{"eyes":"$$"}`
    - `p`: Paranoia `{"eyes":"@@"}`
    - `s`: Stoned `{"eyes":"**","tongue":"U"}`
    - `t`: Tired `{"eyes":"--"}`
    - `w`: Wired `{"eyes":"00"}`
    - `y`: Youthful `{"eyes":".."}`
  - `eyes`: Custom cow eyes. Only the first two characters will be used. The
default value is `oo`
  - `tongue`: Custom cow tongue. Only the first two characters will be used. The
default value is an empty string.
  - `wrap`: Wrap column. Where the message should be wrapped. The default value
is 30 for website and 40 for API requests. For `POST` requests this field
accepts strings and integers. To display the message exactly as provided
(no wrap), use an empty string as wrap value, in general any invalid integer
such as `false`, `null`, arrays or objects are assumed to be no wrap.
  - `json`: Response in JSON format. Any truthy makes the API returns a JSON
with two properties; `res` with a `string` of the cow, and `req` with the
normalized requested data. If any falsy value is given, the API responds with a
plain text with the generated cow. The falsy value is assumed by default.

For website links or `GET` requests use the query string to provide the
parameters. For `POST` requests provide the parameters as a JSON on the request
body.

### Examples

Link to custom web cow: <https://nextmoo.vercel.app/?message=Don%27t+be+sad&cow=small&mode=y>

---

`GET` request with `curl`

```sh
curl 'https://nextmoo.vercel.app/api?message=Whatever+you+want%2C+I+want&tongue=U+'
```

Response

```
 ___________________________
< Whatever you want, I want >
 ---------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
             U  ||----w |
                ||     ||
```

---

`POST` request with `fetch`

```javascript
fetch(`https://nextmoo.vercel.app/api`, {
  method: `POST`,
  body: JSON.stringify({
    message: `Whoever is afraid to die, should not be born.\n\n\t-- The life`,
    cow: `dragon-and-cow`,
    action: `think`,
    mode: `p`,
    wrap: ``
  })
})
  .then(res => res.text())
  .then(text => { console.log(text); });
```

Console output

```
 _______________________________________________
( Whoever is afraid to die, should not be born. )
(                                               )
(         -- The life                           )
 -----------------------------------------------
                       o                    ^    /^
                        o                  / \  // \
                         o   |\___/|      /   \//  .\
                          o  /O  O  \__  /    //  | \ \           *----*
                            /     /  \/_/    //   |  \  \          \   |
                            @___@`    \/_   //    |   \   \         \/\ \
                           0/0/|       \/_ //     |    \    \         \  \
                       0/0/0/0/|        \///      |     \     \       |  |
                    0/0/0/0/0/_|_ /   (  //       |      \     _\     |  /
                 0/0/0/0/0/0/`/,_ _ _/  ) ; -.    |    _ _\.-~       /   /
                             ,-}        _      *-.|.-~-.           .~    ~
            \     \__/        `/\      /                 ~-. _ .-~      /
             \____(@@)           *.   }            {                   /
             (    (--)          .----~-.\        \-`                 .~
             //__\\  \__ Ack!   ///.----..<        \             _ -~
            //    \\               ///-._ _ _ _ _ _ _{^ - - - - ~
```

## License

Licensed under [the MIT license][LICENSE].

Share and enjoy!


<!-- References -->
[moo]: https://github.com/erincones/moo
[cowsayjs]: https://www.npmjs.com/package/cowsayjs
[nextjs]: https://nextjs.org
[vercel]: https://vercel.com

[nextmoo]: https://nextmoo.vercel.app
[nextmooapi]: https://nextmoo.vercel.app/api
[cows]: https://github.com/erincones/nextmoo/tree/master/lib/moo/cows
[LICENSE]: LICENSE
