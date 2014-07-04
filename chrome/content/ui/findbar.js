/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Adblock Plus.
 *
 * The Initial Developer of the Original Code is
 * Wladimir Palant.
 * Portions created by the Initial Developer are Copyright (C) 2006-2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Fake browser implementation to make findbar widget happy - searches in
 * the filter list.
 */
let fastFindBrowser =
{
  //copied from
  //http://codereview.adblockplus.org/5938722247802880/#ps5693417237512192
  finder:
  {
    _resultListeners: [],
    searchString: null,
    caseSensitive: false,
    lastResult: null,

    _notifyResultListeners: function(result, findBackwards)
    {
      this.lastResult = result;
      for each (let listener in this._resultListeners)
        listener.onFindResult(result, findBackwards);
    },

    fastFind: function(searchString, linksOnly, drawOutline)
    {
      this.searchString = searchString;
      let result = treeView.find(this.searchString, 0,
					false,
                                        this.caseSensitive);
      this._notifyResultListeners(result, false);
    },

    findAgain: function(findBackwards, linksOnly, drawOutline)
    {
      let result = treeView.find(this.searchString,
					findBackwards ? -1 : 1,
				        false,
                                        this.caseSensitive);
      this._notifyResultListeners(result, findBackwards);
    },

    addResultListener: function(listener)
    {
      if (this._resultListeners.indexOf(listener) === -1)
        this._resultListeners.push(listener);
    },

    removeResultListener: function(listener)
    {
      let index = this._resultListeners.indexOf(listener);
      if (index !== -1)
        this._resultListeners.splice(index, 1);
    },

    // Irrelevant for us
    highlight: function(highlight, word) {},
    enableSelection: function() {},
    removeSelection: function() {},
    focusContent: function() {},
    keyPress: function() {}
  },

  get _lastSearchString()
  {
    return this.finder.searchString;
  },

  fastFind: {
    get searchString()
    {
      return fastFindBrowser.finder.searchString;
    },

    set searchString(searchString)
    {
      fastFindBrowser.finder.searchString = searchString;
    },

    foundLink: null,
    foundEditable: null,

    get caseSensitive()
    {
      return fastFindBrowser.finder.caseSensitive;
    },

    set caseSensitive(caseSensitive)
    {
      fastFindBrowser.finder.caseSensitive = caseSensitive;
    },


    get currentWindow() { return fastFindBrowser.contentWindow; },

    find: function(searchString, linksOnly)
    {
      fastFindBrowser.finder.fastFind(searchString, linksOnly);
      return fastFindBrowser.finder.lastResult;
    },

    findAgain: function(findBackwards, linksOnly)
    {
      fastFindBrowser.finder.findAgain(findBackwards, linksOnly);
      return fastFindBrowser.finder.lastResult;
    },

    // Irrelevant for us
    init: function() {},
    setDocShell: function() {},
    setSelectionModeAndRepaint: function() {},
    collapseSelection: function() {}
  },
  currentURI: aup.makeURL("http://example.com/"),
  contentWindow: {
    focus: function()
    {
      E("list").focus();
    },
    scrollByLines: function(num)
    {
      E("list").boxObject.scrollByLines(num);
    },
    scrollByPages: function(num)
    {
      E("list").boxObject.scrollByPages(num);
    },
  },

  addEventListener: function(event, handler, capture)
  {
    E("list").addEventListener(event, handler, capture);
  },
  removeEventListener: function(event, handler, capture)
  {
    E("list").addEventListener(event, handler, capture);
  },
}

