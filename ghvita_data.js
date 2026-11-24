
  var Module = typeof Module !== 'undefined' ? Module : {};

  if (!Module['expectedDataFileDownloads']) Module['expectedDataFileDownloads'] = 0;
  Module['expectedDataFileDownloads']++;
  (() => {
    // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
    var isPthread = typeof ENVIRONMENT_IS_PTHREAD !== 'undefined' && ENVIRONMENT_IS_PTHREAD;
    var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER !== 'undefined' && ENVIRONMENT_IS_WASM_WORKER;
    if (isPthread || isWasmWorker) return;
    var isNode = globalThis.process && globalThis.process.versions && globalThis.process.versions.node && globalThis.process.type != 'renderer';
    async function loadPackage(metadata) {

      var PACKAGE_PATH = '';
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')) + '/');
      } else if (typeof process === 'undefined' && typeof location !== 'undefined') {
        // web worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf('/')) + '/');
      }
      var PACKAGE_NAME = 'web/wasm/ghvita.data';
      var REMOTE_PACKAGE_BASE = 'ghvita.data';
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];

      async function fetchRemotePackage(packageName, packageSize) {
        if (isNode) {
          var contents = require('fs').readFileSync(packageName);
          return new Uint8Array(contents).buffer;
        }
        if (!Module['dataFileDownloads']) Module['dataFileDownloads'] = {};
        try {
          var response = await fetch(packageName);
        } catch (e) {
          throw new Error(`Network Error: ${packageName}`, {e});
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.url}`);
        }

        const chunks = [];
        const headers = response.headers;
        const total = Number(headers.get('Content-Length') || packageSize);
        let loaded = 0;

        Module['setStatus'] && Module['setStatus']('Downloading data...');
        const reader = response.body.getReader();

        while (1) {
          var {done, value} = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          Module['dataFileDownloads'][packageName] = {loaded, total};

          let totalLoaded = 0;
          let totalSize = 0;

          for (const download of Object.values(Module['dataFileDownloads'])) {
            totalLoaded += download.loaded;
            totalSize += download.total;
          }

          Module['setStatus'] && Module['setStatus'](`Downloading data... (${totalLoaded}/${totalSize})`);
        }

        const packageData = new Uint8Array(chunks.map((c) => c.length).reduce((a, b) => a + b, 0));
        let offset = 0;
        for (const chunk of chunks) {
          packageData.set(chunk, offset);
          offset += chunk.length;
        }
        return packageData.buffer;
      }

      var fetchPromise;
      var fetched = Module['getPreloadedPackage'] && Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);

      if (!fetched) {
        // Note that we don't use await here because we want to execute the
        // the rest of this function immediately.
        fetchPromise = fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
      }

    async function runWithFS(Module) {

      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
Module['FS_createPath']("/", "assets", true, true);
Module['FS_createPath']("/assets", "avatars", true, true);
Module['FS_createPath']("/assets", "band", true, true);
Module['FS_createPath']("/assets/band", "alt", true, true);
Module['FS_createPath']("/assets/band", "thumb", true, true);
Module['FS_createPath']("/assets", "crowd", true, true);
Module['FS_createPath']("/assets", "sfx", true, true);
Module['FS_createPath']("/", "data", true, true);
Module['FS_createPath']("/data", "songs", true, true);
Module['FS_createPath']("/data/songs", "desert", true, true);

      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, 'bad input to processPackageData ' + arrayBuffer.constructor.name);
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
          for (var file of metadata['files']) {
            var name = file['filename'];
            var data = byteArray.subarray(file['start'], file['end']);
            // canOwn this data in the filesystem, it is a slice into the heap that will never change
        Module['FS_createDataFile'](name, null, data, true, true, true);
          }
          Module['removeRunDependency']('datafile_web/wasm/ghvita.data');
      }
      Module['addRunDependency']('datafile_web/wasm/ghvita.data');

      if (!Module['preloadResults']) Module['preloadResults'] = {};

      Module['preloadResults'][PACKAGE_NAME] = {fromCache: false};
      if (!fetched) {
        fetched = await fetchPromise;
      }
      await processPackageData(fetched);

    }
    // Detect whether the module JS file has already been loaded.
    if (Module['FS_createPath']) {
      runWithFS(Module);
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module['preRun'].push(runWithFS); // FS is not initialized yet, wait for it
    }

    }
    loadPackage({"files": [{"filename": "/assets/avatars/01_world_tour.jpg", "start": 0, "end": 20075}, {"filename": "/assets/avatars/03_griffin.jpg", "start": 20075, "end": 41342}, {"filename": "/assets/avatars/10_mag_kerrang.jpg", "start": 41342, "end": 57664}, {"filename": "/assets/avatars/11_mag_ap.jpg", "start": 57664, "end": 70857}, {"filename": "/assets/avatars/12_mag_decibel.jpg", "start": 70857, "end": 82728}, {"filename": "/assets/avatars/13_mag_gplayer.jpg", "start": 82728, "end": 96382}, {"filename": "/assets/avatars/14_mag_paste.jpg", "start": 96382, "end": 110030}, {"filename": "/assets/avatars/15_mag_hell.jpg", "start": 110030, "end": 122437}, {"filename": "/assets/avatars/16_mag_backyard.jpg", "start": 122437, "end": 137115}, {"filename": "/assets/avatars/17_mag_bar.jpg", "start": 137115, "end": 150995}, {"filename": "/assets/band/alt/vocalist.png", "start": 150995, "end": 377460}, {"filename": "/assets/band/alt/vocalist_2.png", "start": 377460, "end": 557648}, {"filename": "/assets/band/alt/vocalist_3.png", "start": 557648, "end": 747500}, {"filename": "/assets/band/alt/vocalist_4.png", "start": 747500, "end": 954646}, {"filename": "/assets/band/band.txt", "start": 954646, "end": 954832}, {"filename": "/assets/band/bassist.png", "start": 954832, "end": 1288389}, {"filename": "/assets/band/bassist_2.png", "start": 1288389, "end": 1610844}, {"filename": "/assets/band/bassist_3.png", "start": 1610844, "end": 1974215}, {"filename": "/assets/band/bassist_4.png", "start": 1974215, "end": 2323495}, {"filename": "/assets/band/bassist_5.png", "start": 2323495, "end": 2926013}, {"filename": "/assets/band/drummer.png", "start": 2926013, "end": 3046946}, {"filename": "/assets/band/drummer_2.png", "start": 3046946, "end": 3191764}, {"filename": "/assets/band/drummer_3.png", "start": 3191764, "end": 3304094}, {"filename": "/assets/band/drummer_4.png", "start": 3304094, "end": 3429456}, {"filename": "/assets/band/guitarist.png", "start": 3429456, "end": 3791180}, {"filename": "/assets/band/guitarist_2.png", "start": 3791180, "end": 4139123}, {"filename": "/assets/band/guitarist_3.png", "start": 4139123, "end": 4507692}, {"filename": "/assets/band/guitarist_4.png", "start": 4507692, "end": 4881331}, {"filename": "/assets/band/guitarist_5.png", "start": 4881331, "end": 5205854}, {"filename": "/assets/band/rise.txt", "start": 5205854, "end": 5207346}, {"filename": "/assets/band/thumb/bassist.png", "start": 5207346, "end": 5248829}, {"filename": "/assets/band/thumb/bassist_2.png", "start": 5248829, "end": 5284831}, {"filename": "/assets/band/thumb/bassist_3.png", "start": 5284831, "end": 5327733}, {"filename": "/assets/band/thumb/bassist_4.png", "start": 5327733, "end": 5368532}, {"filename": "/assets/band/thumb/bassist_5.png", "start": 5368532, "end": 5420536}, {"filename": "/assets/band/thumb/drummer.png", "start": 5420536, "end": 5529134}, {"filename": "/assets/band/thumb/drummer_2.png", "start": 5529134, "end": 5639886}, {"filename": "/assets/band/thumb/drummer_3.png", "start": 5639886, "end": 5752755}, {"filename": "/assets/band/thumb/drummer_4.png", "start": 5752755, "end": 5861438}, {"filename": "/assets/band/thumb/guitarist.png", "start": 5861438, "end": 5904969}, {"filename": "/assets/band/thumb/guitarist_2.png", "start": 5904969, "end": 5940912}, {"filename": "/assets/band/thumb/guitarist_3.png", "start": 5940912, "end": 5982119}, {"filename": "/assets/band/thumb/guitarist_4.png", "start": 5982119, "end": 6025308}, {"filename": "/assets/band/thumb/guitarist_5.png", "start": 6025308, "end": 6058196}, {"filename": "/assets/band/thumb/vocalist.png", "start": 6058196, "end": 6092286}, {"filename": "/assets/band/thumb/vocalist_2.png", "start": 6092286, "end": 6118477}, {"filename": "/assets/band/thumb/vocalist_3.png", "start": 6118477, "end": 6150897}, {"filename": "/assets/band/thumb/vocalist_4.png", "start": 6150897, "end": 6184850}, {"filename": "/assets/band/vocalist.png", "start": 6184850, "end": 6619866}, {"filename": "/assets/band/vocalist_2.png", "start": 6619866, "end": 6995407}, {"filename": "/assets/band/vocalist_3.png", "start": 6995407, "end": 7334983}, {"filename": "/assets/band/vocalist_4.png", "start": 7334983, "end": 7723647}, {"filename": "/assets/bg_menu.jpg", "start": 7723647, "end": 7833806}, {"filename": "/assets/bg_results.jpg", "start": 7833806, "end": 7977857}, {"filename": "/assets/bg_stage.jpg", "start": 7977857, "end": 8019365}, {"filename": "/assets/bg_title.jpg", "start": 8019365, "end": 8200058}, {"filename": "/assets/crowd/crowd_ped_01.png", "start": 8200058, "end": 8222518}, {"filename": "/assets/crowd/crowd_ped_02.png", "start": 8222518, "end": 8241949}, {"filename": "/assets/crowd/crowd_ped_03.png", "start": 8241949, "end": 8264665}, {"filename": "/assets/crowd/crowd_ped_04.png", "start": 8264665, "end": 8283771}, {"filename": "/assets/crowd/crowd_pedf_1.png", "start": 8283771, "end": 8309346}, {"filename": "/assets/crowd/crowd_pedf_2.png", "start": 8309346, "end": 8331071}, {"filename": "/assets/crowd_hands.png", "start": 8331071, "end": 8456462}, {"filename": "/assets/font_title.fnt", "start": 8456462, "end": 8460258}, {"filename": "/assets/font_ui.fnt", "start": 8460258, "end": 8470714}, {"filename": "/assets/game.png", "start": 8470714, "end": 9822631}, {"filename": "/assets/game.txt", "start": 9822631, "end": 9829070}, {"filename": "/assets/hud.png", "start": 9829070, "end": 11707578}, {"filename": "/assets/hud.txt", "start": 11707578, "end": 11710113}, {"filename": "/assets/logo.png", "start": 11710113, "end": 11870339}, {"filename": "/assets/norway.v3d", "start": 11870339, "end": 12344893}, {"filename": "/assets/sfx/applause.ogg", "start": 12344893, "end": 12417812}, {"filename": "/assets/sfx/boo_1.ogg", "start": 12417812, "end": 12447478}, {"filename": "/assets/sfx/boo_2.ogg", "start": 12447478, "end": 12486738}, {"filename": "/assets/sfx/boo_3.ogg", "start": 12486738, "end": 12524854}, {"filename": "/assets/sfx/cheer_1.ogg", "start": 12524854, "end": 12545453}, {"filename": "/assets/sfx/cheer_2.ogg", "start": 12545453, "end": 12575020}, {"filename": "/assets/sfx/cheer_3.ogg", "start": 12575020, "end": 12597686}, {"filename": "/assets/sfx/crowd_bad.ogg", "start": 12597686, "end": 12656036}, {"filename": "/assets/sfx/crowd_good.ogg", "start": 12656036, "end": 12754107}, {"filename": "/assets/sfx/crowd_neutral.ogg", "start": 12754107, "end": 12846484}, {"filename": "/assets/sfx/drum_crash_1.ogg", "start": 12846484, "end": 12885859}, {"filename": "/assets/sfx/drum_crash_2.ogg", "start": 12885859, "end": 12925234}, {"filename": "/assets/sfx/drum_hat_1.ogg", "start": 12925234, "end": 12934433}, {"filename": "/assets/sfx/drum_hat_2.ogg", "start": 12934433, "end": 12943736}, {"filename": "/assets/sfx/drum_hat_3.ogg", "start": 12943736, "end": 12952992}, {"filename": "/assets/sfx/drum_kick_1.ogg", "start": 12952992, "end": 12962971}, {"filename": "/assets/sfx/drum_kick_2.ogg", "start": 12962971, "end": 12972983}, {"filename": "/assets/sfx/drum_kick_3.ogg", "start": 12972983, "end": 12983051}, {"filename": "/assets/sfx/drum_ride_1.ogg", "start": 12983051, "end": 13006175}, {"filename": "/assets/sfx/drum_ride_2.ogg", "start": 13006175, "end": 13029299}, {"filename": "/assets/sfx/drum_snare_1.ogg", "start": 13029299, "end": 13040364}, {"filename": "/assets/sfx/drum_snare_2.ogg", "start": 13040364, "end": 13051318}, {"filename": "/assets/sfx/drum_snare_3.ogg", "start": 13051318, "end": 13062288}, {"filename": "/assets/sfx/drum_tom_hi_1.ogg", "start": 13062288, "end": 13075220}, {"filename": "/assets/sfx/drum_tom_hi_2.ogg", "start": 13075220, "end": 13088262}, {"filename": "/assets/sfx/drum_tom_lo_1.ogg", "start": 13088262, "end": 13102369}, {"filename": "/assets/sfx/drum_tom_lo_2.ogg", "start": 13102369, "end": 13116470}, {"filename": "/assets/sfx/drum_tom_mid_1.ogg", "start": 13116470, "end": 13129460}, {"filename": "/assets/sfx/drum_tom_mid_2.ogg", "start": 13129460, "end": 13142517}, {"filename": "/assets/sfx/miss.ogg", "start": 13142517, "end": 13157744}, {"filename": "/assets/sfx/overstrum_1.ogg", "start": 13157744, "end": 13166365}, {"filename": "/assets/sfx/overstrum_2.ogg", "start": 13166365, "end": 13174586}, {"filename": "/assets/sfx/overstrum_3.ogg", "start": 13174586, "end": 13182103}, {"filename": "/assets/sfx/overstrum_4.ogg", "start": 13182103, "end": 13189960}, {"filename": "/assets/sfx/sp_award.ogg", "start": 13189960, "end": 13229970}, {"filename": "/assets/sfx/sp_crowd.ogg", "start": 13229970, "end": 13355648}, {"filename": "/assets/sfx/sp_deploy.ogg", "start": 13355648, "end": 13424340}, {"filename": "/assets/sfx/sp_ready.ogg", "start": 13424340, "end": 13456261}, {"filename": "/assets/sfx/sp_release.ogg", "start": 13456261, "end": 13473944}, {"filename": "/assets/sfx/star.ogg", "start": 13473944, "end": 13506632}, {"filename": "/assets/sfx/star_gold.ogg", "start": 13506632, "end": 13538921}, {"filename": "/assets/sfx/ui_back.ogg", "start": 13538921, "end": 13544256}, {"filename": "/assets/sfx/ui_move.ogg", "start": 13544256, "end": 13548694}, {"filename": "/assets/sfx/ui_select.ogg", "start": 13548694, "end": 13553962}, {"filename": "/assets/stage.png", "start": 13553962, "end": 13606220}, {"filename": "/assets/stage.txt", "start": 13606220, "end": 13606518}, {"filename": "/assets/vignette.png", "start": 13606518, "end": 13625752}, {"filename": "/data/songs/desert/album.png", "start": 13625752, "end": 13640836}, {"filename": "/data/songs/desert/guitar.ogg", "start": 13640836, "end": 15192100}, {"filename": "/data/songs/desert/notes.chart", "start": 15192100, "end": 15291546}, {"filename": "/data/songs/desert/song.ini", "start": 15291546, "end": 15291905}, {"filename": "/data/songs/desert/song.ogg", "start": 15291905, "end": 16804419}, {"filename": "/data/songs/list.txt", "start": 16804419, "end": 16804619}], "remote_package_size": 16804619});

  })();
