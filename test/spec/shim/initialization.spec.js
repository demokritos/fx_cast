"use strict";

describe("api behaviour", () => {
    beforeAll(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });

    afterAll(() => {
        // Stop running receiver application if session was created
        if (this.session) {
            this.session.stop();
        }
    });

    it("can initialize", done => {
        const sessionRequest = new chrome.cast.SessionRequest(
                chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);

        expect(sessionRequest.appId).toBe("CC1AD845");

        function onInitializeSuccess () {}
        function onInitializeError (err) {
            fail(err);
            done.fail();
        }

        function receiverListener (availability) {
            if (availability === chrome.cast.ReceiverAvailability.AVAILABLE) {
                done();
            }
        }

        const apiConfig = new chrome.cast.ApiConfig(
                sessionRequest
              , () => {}
              , receiverListener);

        chrome.cast.initialize(apiConfig
              , onInitializeSuccess
              , onInitializeError);
    });

    it("can request session", done => {
        if (/Chrome/.test(navigator.userAgent)) {
            pending("cannot run in chrome");
        }

        const self = this;

        function onRequestSessionSuccess (session) {
            expect(session.appId).toBe(
                    chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);

            expect(session.appImages).toEqual([]);
            expect(session.displayName).toBe("Default Media Receiver");
            expect(session.media).toEqual([]);
            expect(session.senderApps).toEqual([]);
            expect(session.status).toBe("connected");
            expect(session.statusText).toBe("Default Media Receiver");

            expect(session.namespaces).toEqual(jasmine.arrayContaining([
                { name: "urn:x-cast:com.google.cast.cac" }
              , { name: "urn:x-cast:com.google.cast.debugoverlay" }
              , { name: "urn:x-cast:com.google.cast.broadcast" }
              , { name: "urn:x-cast:com.google.cast.media" }
            ]));

            self.session = session;

            done();
        }

        function onRequestSessionError (err) {
            fail(err);
            done.fail();
        }

        chrome.cast.requestSession(
                onRequestSessionSuccess
              , onRequestSessionError);
    });
});
