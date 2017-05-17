""" Server side for dExplorer post recommendation """
from flask import Flask, request, render_template_string, redirect, url_for, jsonify
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

postsData = {}
postsSims = {}

@app.route('/')
def home():
    print 'home'
    return render_template_string("<body>Yo!!!</body>")

@app.route('/api/posts', methods=['POST'])
def posts():
    if request.method == 'POST':
        # print "Request", request.json

        # analyze the posts
        for post_dict in request.json['postsData']:
            # print post_dict.keys() # [u'url', u'user-id', u'post-text', u'post-id']
            print post_dict['post-id']
            pkey = (post_dict['url'], post_dict['post-id'])
            postsData[pkey] = {
                'text':post_dict['post-text'],
                'user_id':post_dict['user-id']
            }

            # calculate this post's pairwise document similarities
            # for all posts we don't have a comparison for yet
            print 'Calculating similarities'
            for simkey in postsData:
                if pkey != simkey and (pkey, simkey) not in postsSims and (simkey, pkey) not in postsSims:
                    sim = 1.0 #pipline.predict(post_dict['post-text'], postsData[simkey]['text'])
                    postsSims[(pkey, simkey)] = postsSims[(simkey, pkey)] = sim

        # slice out all of this url's post similarities and send them back
        url = request.json['url']
        sims = { "({},{})".format(anchorkey[1], candidatekey[1]):score for (anchorkey, candidatekey), score in postsSims.items()
                 if anchorkey[0] == url and candidatekey[0] == url }
        print len(sims)
        print sims
        return jsonify(sims)

###########
# HELPERS #
###########
def save_post():
    pass

def transform_post():
    pass

if __name__ == '__main__':
    # print "password is: DeXPLORER"
    # http://www.akadia.com/services/ssh_test_certificate.html
    # passphrase: DeXPLORER
    context = ('./certs/server.crt', './certs/server.key')
    app.run(host="localhost", port=5000, debug=True, threaded=False, ssl_context=context)
