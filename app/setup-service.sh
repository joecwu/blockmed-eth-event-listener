#!/bin/bash
cp blockmed-eth-event-listener.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable blockmed-eth-event-listener