export const privacy = (privacyType) => {
    return (req, res, next) => {
        const { user } = req.session;
        switch (privacyType) {
            case 'private':
                if (user) next()
                else res.redirect('/login')
            break;
            case "no_auth":
                if (!user) next()
                else res.redirect('/products')
            break;
        }
    }
}