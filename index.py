from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    num = request.args.get("num")

    if not num:
        return jsonify({
            "status": False,
            "error": "num parameter missing",
            "usage": "/?num=9876543210"
        }), 400

    url = "https://apigw.umangapp.in/ioclApi/ws1/consumervalidate"

    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
        "Accept": "application/json",
        "Content-Type": "application/json",
        "subsid": "0",
        "deptid": "186",
        "formtrkr": "0",
        "x-api-key": "VKE9PnbY5k1ZYapR5PyYQ33I26sXTX569Ed7eqyg",
        "srvid": "1123",
        "subsid2": "0",
        "origin": "https://web.umang.gov.in",
        "referer": "https://web.umang.gov.in/"
    }

    payload = {
        "tkn": "nx0c75b7cd-d804-4de0-9d5d-35c2d1879586/1",
        "trkr": "213132",
        "lang": "en",
        "lat": "21",
        "lon": "90",
        "lac": "90",
        "usag": "90",
        "apitrkr": "123234",
        "usrid": "09",
        "mode": "web",
        "pltfrm": "android",
        "did": "123234",
        "deptid": "186",
        "formtrkr": "0",
        "srvid": "1123",
        "subsid": "0",
        "subsid2": "0",
        "trackingId": "",
        "source": "UMANG",
        "mobile": num,
        "consumerId": "",
        "partnerCode": "",
        "consumerNumber": ""
    }

    try:
        res = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=20
        )

        try:
            data = res.json()
        except:
            return jsonify({
                "status": False,
                "error": "Invalid JSON response from upstream",
                "raw": res.text
            }), 500

        return jsonify({
            "status": True,
            "code": res.status_code,
            "response": data
        })

    except requests.exceptions.Timeout:
        return jsonify({
            "status": False,
            "error": "Request timeout"
        }), 504

    except Exception as e:
        return jsonify({
            "status": False,
            "error": str(e)
        }), 500

# Vercel ke liye
app = app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
