/**
 * Created with JetBrains WebStorm.
 * User: Sascha Ißbrücker
 * Date: 16.02.13
 * Time: 11:42
 *
 * Copyright (c) 2013 simonigence gmbh
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var ExampleTab = function (title, templateId) {

    var self = this;

    self.title = ko.observable(title);
    self.templateId = ko.observable(templateId);
};

var Example = function (tabs, isShowLogButton) {

    var self = this;

    self.tabs = ko.observableArray(tabs);
    self.selectedTab = ko.observable(null);
    self.isShowLogButton = ko.observable(isShowLogButton);

    self.selectTab = function (tab) {

        self.selectedTab(tab);
    };

    self.selectTab(tabs[0]);
};

var App = function () {

    var self = this;

    self.applicationKey = ko.observable('mail_job');
    self.applicationKeyLength = ko.computed(function () {
        return Math.max(2, self.applicationKey().length);
    });
    self.eventKey = ko.observable('mail_job_finished');
    self.eventKeyLength = ko.computed(function () {
        return Math.max(2, self.eventKey().length);
    });

    self.resultValue = ko.observable('success');
    self.resultValueLength = ko.computed(function () {
        return Math.max(2, self.resultValue().length);
    });
    self.mailsDeliveredValue = ko.observable('47');
    self.mailsDeliveredValueLength = ko.computed(function () {
        return Math.max(2, self.mailsDeliveredValue().length);
    });
    self.durationValue = ko.observable('278.43');
    self.durationValueLength = ko.computed(function () {
        return Math.max(2, self.durationValue().length);
    });

    self.isEventSent = ko.observable(false);
    self.sentEventCount = ko.observable(0);
    self.sentEventsDisplayText = ko.computed(function () {

        if (self.sentEventCount() == 1)
            return 'You have sent an event!';

        return 'You have sent ' + self.sentEventCount() + ' events!';
    });

    self.viewUrl = ko.computed(function() {

        return 'http://test.logdirector.com/logdirector/index.jsp?user=admin&password=admin&app=' + self.applicationKey();
    });

    self.httpExample = new Example(

        // Tabs
        [
            new ExampleTab('HTTP', 'template-http')
        ],
        true
    );

    self.apiExample = new Example(

        // Tabs
        [
            new ExampleTab('Java API', 'template-api-java'),
            new ExampleTab('C# API', 'template-api-csharp')
        ],
        false
    );

    self.codeGenerationExample = new Example(

        // Tabs
        [
            new ExampleTab('Generated Java code', 'template-codegen-java'),
            new ExampleTab('Generated C# code', 'template-codegen-csharp')
        ],
        false
    );

    self.log = function () {

        logdirector.configure('http://test.logdirector.com/logdirector', self.applicationKey());

        var attributes = {};

        attributes['result:string'] = self.resultValue();
        attributes['mails_delivered:integer'] = self.mailsDeliveredValue();
        attributes['duration:decimal'] = self.durationValue();

        var request = logdirector.log(self.eventKey(), attributes);

        request.onreadystatechange = function () {

            if (request.readyState == 4) {

                // Check if the event was stored
                /* Does not work due to cross-domain issues :(
                 if(request.responseText && request.responseText.indexOf('Failed events=0') >= 0) {

                 // Set sent flag
                 self.isEventSent(true);
                 }
                 */
                self.isEventSent(true);
                self.sentEventCount(self.sentEventCount() + 1);
            }
        };
    };

    self.inputMouseUp = function (data, event) {

        event.target.select();

        return false;
    };

    self.inputFocus = function (data, event) {

        $(event.target).addClass('example-codetext-input-selected');
        $(event.target).closest('.example-codetext').addClass('example-codetext-muted');

        event.target.select();

        return false;
    };

    self.inputBlur = function (data, event) {

        $(event.target).removeClass('example-codetext-input-selected');
        $(event.target).closest('.example-codetext').removeClass('example-codetext-muted');
    };

};